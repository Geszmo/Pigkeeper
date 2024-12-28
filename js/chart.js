import { app, getDatabase, ref, onValue, set, db, query, collection, where, getDocs } from "./firebaseConfig.js";
import { fetchPigsData } from './analytics/analytics.js';

// Initialize Realtime Database
const realTimedb = getDatabase(app);

// Define paths with userID
const userDevicesPath = `UserID/${loggedInUserId}/Devices`;

const humidityRef = ref(realTimedb, `${userDevicesPath}/DHT/Humidity`);
const temperatureRef = ref(realTimedb, `${userDevicesPath}/DHT/Temperature`);
const selectedYearIncomeExpense = document.getElementById('selectedYearIncomeExpense');

const existingYears = []; // Array to track added years
const financialData = {};
const pigletsDataMap = {};

// Initialize charts globally
let humidityChart;
let temperatureChart;

// Initialize selectedYear variable
selectedYearIncomeExpense.addEventListener('change', () => {
    const selectedYear = selectedYearIncomeExpense.value;
    ExpenseIncomeChart(financialData, selectedYear, selectedYear === 'All');
    soldDeceasedChart(pigletsDataMap, selectedYear, selectedYear === 'All');
})

// Fetch data from Firebase and update charts
function updateCharts() {
    onValue(humidityRef, (snapshot) => {
        const humidity = snapshot.val();
        if (humidityChart) {
            humidityChart.series[0].setData([humidity !== null ? humidity : 0]); // Update chart with new data
        }
    });

    onValue(temperatureRef, (snapshot) => {
        const temperature = snapshot.val();
        if (temperatureChart) {
            temperatureChart.series[0].setData([temperature !== null ? temperature : 0]); // Update chart with new data
        }
    });
};

async function fetchExpenseIncome() {
    try {
        const financeQuery = query(collection(db, "FinancialRecord"), where("loggedInUserId", "==", loggedInUserId));
        const querySnapshot = await getDocs(financeQuery);

        // Initialize a map to store the data by month
        defaultMonths.forEach(month => {
            financialData[`${month} ${currentYear}`] = { Income: 0, Expense: 0, IncomeDates: [], ExpenseDates: [] };
        });

        // Process query results
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const transactionDate = new Date(data.dateFinance);
                const month = transactionDate.toLocaleString('en-US', { month: 'short' });
                const year = transactionDate.getFullYear();
                const fullMonth = `${month} ${year}`; // Format as "MMM YYYY"
                const fullDate = transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // Full date

                const qty = extractNumber(data.qty || 0); // Ensure default 0 if null
                const price = extractNumber(data.price || 0);
                const total = qty * price;

                // Initialize the map for this month if not already present
                if (!financialData[fullMonth]) {
                    financialData[fullMonth] = { Income: 0, Expense: 0, IncomeDates: [], ExpenseDates: [] };
                }

                // Add the data based on the type
                if (data.type === "Income") {
                    financialData[fullMonth].Income = 0;
                    financialData[fullMonth].Income += total;
                    const incomeEntry = `${fullDate} (Income: ${formatNumberWithCommas(total)})`;
                    if (!financialData[fullMonth].IncomeDates.includes(incomeEntry)) {
                        financialData[fullMonth].IncomeDates.push(incomeEntry);
                    }
                } else {
                    financialData[fullMonth].Expense = 0;
                    financialData[fullMonth].Expense += total;
                    const expenseEntry = `${fullDate} (Expense: ${formatNumberWithCommas(total)})`;
                    if (!financialData[fullMonth].ExpenseDates.includes(expenseEntry)) {
                        financialData[fullMonth].ExpenseDates.push(expenseEntry);
                    }
                }

                // Add the year to the array if it doesn't already exist
                if (!existingYears.includes(year)) {
                    existingYears.push(year);
                }
            });
        }

        selectedYearIncomeExpense.innerHTML = '';

        const option = document.createElement('option');
        option.text = 'All';
        option.value = 'All';
        selectedYearIncomeExpense.appendChild(option);

        // Sort the years from oldest to latest
        existingYears.sort((a, b) => b - a);
        // Add the sorted years to the dropdown
        existingYears.forEach((year, index) => {
            const option = document.createElement('option');
            option.text = year;
            option.value = year;
            if (index === 0) {
                option.selected = true; // Select the first year by default
            }
            selectedYearIncomeExpense.appendChild(option); // Append the option to the dropdown
        });

        ExpenseIncomeChart(financialData);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function ExpenseIncomeChart(financialData, selectedYear = currentYear, all) {
    // Combine all months (default + fetched) and sort by date
    const allMonths = Object.keys(financialData);
    const sortedMonths = [...new Set([...defaultMonths.map(month => `${month} ${new Date().getFullYear()}`), ...allMonths])];

    // Prepare categories data
    let categories;

    if (all) {
        categories = sortedMonths.sort((a, b) => new Date(a) - new Date(b)); // Sort by date
    } else {
        categories = defaultMonths.map(month => `${month} ${selectedYear}`); // Ensure all default months are included
    }

    const IncomeData = categories.map(month => financialData[month]?.Income || 0);
    const ExpenseData = categories.map(month => financialData[month]?.Expense || 0);

    // Combine tooltips for IncomeData and ExpenseData
    const tooltipData = categories.map(month => {
        const Income = financialData[month]?.IncomeDates.join('<br>') || "No Income Data";
        const Expense = financialData[month]?.ExpenseDates.join('<br>') || "No Expense Data";
        return {
            IncomeTooltip: Income,
            ExpenseTooltip: Expense
        };
    });

    // Highcharts configuration
    Highcharts.chart('financeChart', {
        chart: {
            type: 'column',
            animation: {
                duration: 800,
                easing: 'easeOutBounce', // Smooth bounce effect
            },
        },
        title: {
            text: 'Income & Expense',
            style: {
                fontSize: '16px',
                color: '#444',
                fontWeight: 'bold',
            },
        },
        xAxis: {
            categories: categories,
            crosshair: true,
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#666',
                },
            },
            lineColor: '#ccc',
            lineWidth: 1,
        },
        yAxis: {
            allowDecimals: false,
            title: { text: null },
            gridLineColor: '#f0f0f0',
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#666',
                },
            },
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            itemStyle: {
                fontSize: '12px',
                fontWeight: 'normal',
                color: '#444',
            },
        },
        tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ccc',
            borderRadius: 8,
            style: {
                color: '#333',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif'
            },
            formatter: function () {
                if (this.series.name === 'Income') {
                    return `<b>Total Income: ${formatNumberWithCommas(this.y)}</b><br>${tooltipData[this.point.index].IncomeTooltip}`;
                } else if (this.series.name === 'Expense') {
                    return `<b>Total Expense: ${formatNumberWithCommas(this.y)}</b><br>${tooltipData[this.point.index].ExpenseTooltip}`;
                }
            },
        },
        plotOptions: {
            column: {
                borderRadius: 20, // Rounded corners for bars
                dataLabels: {
                    // enabled: true, // Show values on bars
                    // format: '{y}', // Display the value
                    style: {
                        fontWeight: 'bold',
                        color: '#444', // Ensure readability
                    },
                },
            },
        },
        series: [{
            name: 'Income',
            color: "#71A971",
            data: IncomeData,
            marker: {
                enabled: false
            }
        }, {
            name: 'Expense',
            color: "#FF5757",
            data: ExpenseData,
            marker: {
                enabled: false
            }
        }],
    });
}

async function fetchSoldDeceasedData() {
    try {
        // Query to fetch documents by loggedInUserId
        const pigQuery = query(
            collection(db, "PigletsRecords"),
            where("loggedInUserId", "==", loggedInUserId)
        );

        // Process query results
        const querySnapshot = await getDocs(pigQuery);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const transactionDate = new Date(data.date);
                const month = transactionDate.toLocaleString('en-US', { month: 'short' });
                const year = transactionDate.getFullYear();
                const fullMonth = `${month} ${year}`; // Format as "MMM YYYY"
                const fullDate = transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // Full date

                const count = parseInt(data.numberOfPig, 10) || 0;

                // Initialize the map for this month if not already present
                if (!pigletsDataMap[fullMonth]) {
                    pigletsDataMap[fullMonth] = { Sold: 0, Deceased: 0, soldDates: [], deceasedDates: [] };
                }

                // Add the data based on the status
                if (data.status === "Sold") {
                    pigletsDataMap[fullMonth].Sold = 0;
                    pigletsDataMap[fullMonth].Sold += count;
                    if (!pigletsDataMap[fullMonth].soldDates.includes(`${fullDate} (Sold: ${count})`)) {
                        pigletsDataMap[fullMonth].soldDates.push(`${fullDate} (Sold: ${count})`);
                    }
                } else if (data.status === "Deceased") {
                    pigletsDataMap[fullMonth].Deceased = 0;
                    pigletsDataMap[fullMonth].Deceased += count;
                    if (!pigletsDataMap[fullMonth].deceasedDates.includes(`${fullDate} (Deceased: ${count})`)) {
                        pigletsDataMap[fullMonth].deceasedDates.push(`${fullDate} (Deceased: ${count})`);
                    }
                }

            });
        }

        soldDeceasedChart(pigletsDataMap);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function soldDeceasedChart(pigletsDataMap, selectedYear = currentYear, all) {
    // Combine all months (default + fetched) and sort by date
    const allMonths = Object.keys(pigletsDataMap);
    const sortedMonths = [...new Set([...defaultMonths.map(month => `${month} ${new Date().getFullYear()}`), ...allMonths])];

    // Prepare categories data
    let categories;

    if (all) {
        categories = sortedMonths.sort((a, b) => new Date(a) - new Date(b)); // Sort by date
    } else {
        categories = defaultMonths.map(month => `${month} ${selectedYear}`); // Ensure all default months are included
    }

    // Prepare chart data 
    const soldData = categories.map(month => (pigletsDataMap[month]?.Sold || 0));
    const deceasedData = categories.map(month => (pigletsDataMap[month]?.Deceased || 0));

    // Combine tooltips for Sold and Deceased
    const tooltipData = categories.map(month => {
        const sold = pigletsDataMap[month]?.soldDates.join('<br>') || "No Sold Data";
        const deceased = pigletsDataMap[month]?.deceasedDates.join('<br>') || "No Deceased Data";
        return {
            soldTooltip: sold,
            deceasedTooltip: deceased
        };
    });

    // Highcharts configuration
    Highcharts.chart('pigletChart', {
        chart: {
            type: 'column',
            animation: {
                duration: 800,
                easing: 'easeOutBounce', // Smooth bounce effect
            },
        },
        title: {
            text: 'Sold & Deceased',
            style: {
                fontSize: '16px',
                color: '#444',
                fontWeight: 'bold',
            },
        },
        xAxis: {
            categories: categories,
            crosshair: true,
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#666',
                },
            },
            lineColor: '#ccc',
            lineWidth: 1,
        },
        yAxis: {
            allowDecimals: false,
            title: { text: null },
            gridLineColor: '#f0f0f0',
            labels: {
                style: {
                    fontSize: '12px',
                    color: '#666',
                },
            },
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            itemStyle: {
                fontSize: '12px',
                fontWeight: 'normal',
                color: '#444',
            },
        },
        plotOptions: {
            column: {
                borderRadius: 20, // Rounded corners for bars
                dataLabels: {
                    // enabled: true, // Show values on bars
                    // format: '{y}', // Display the value
                    style: {
                        fontWeight: 'bold',
                        color: '#444', // Ensure readability
                    },
                },
            },
        },
        tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#ccc',
            borderRadius: 8,
            style: {
                color: '#333',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif'
            },
            formatter: function () {
                if (this.series.name === 'Sold') {
                    return `<b>Total Sold: ${formatNumberWithCommas(this.y)}</b><br>${tooltipData[this.point.index].soldTooltip}`;
                } else if (this.series.name === 'Deceased') {
                    return `<b>Total Deceased: ${formatNumberWithCommas(this.y)}</b><br>${tooltipData[this.point.index].deceasedTooltip}`;
                }
            },
        },
        series: [{
            name: 'Sold',
            color: "#71A971",
            data: soldData,
            marker: {
                enabled: false
            }
        }, {
            name: 'Deceased',
            color: "#FF5757",
            data: deceasedData,
            marker: {
                enabled: false
            }
        }],
    });
}

// Initialize Humidity Chart
humidityChart = Highcharts.chart('humidityChart', {
    chart: {
        type: 'solidgauge',
        margin: [0, 0, 0, 0],
        backgroundColor: 'transparent'
    },
    title: null,
    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickWidth: 0,
        // tickPositions: [0, 100],
        tickmarkPlacement: 'between',
        minorTickLength: 0,
        // labels: {
        //     enabled: true,
        //     x: 0,
        //     y: 25,
        //     style: {
        //         color: '#999',
        //     }
        // },
    },
    pane: {
        size: '100%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 360,
        background: {
            borderWidth: 20,
            backgroundColor: '#EAEAFD',
            shape: 'arc',
            borderColor: '#EAEAFD',
            outerRadius: '90%',
            innerRadius: '90%'
        }
    },
    // pane: {
    //     size: '150%',
    //     center: ['50%', '80%'],
    //     startAngle: -90,
    //     endAngle: 90,
    //     background: {
    //         borderWidth: 20,
    //         backgroundColor: '#EAEAFD',
    //         shape: 'arc',
    //         borderColor: '#EAEAFD',
    //         outerRadius: '90%',
    //         innerRadius: '90%'
    //     }
    // },
    tooltip: {
        enabled: false
    },
    plotOptions: {
        solidgauge: {
            borderColor: '#0CC0DF',
            borderWidth: 15,
            radius: 90,
            innerRadius: '90%',
            dataLabels: {
                y: -25,
                borderWidth: 0,
                useHTML: true
            }
        }
    },
    series: [{
        name: 'Humidity',
        data: [0], // Initial data placeholder
        dataLabels: {
            format: '<div style="text-align:center;"><span style="font-size:24px;color:#0CC0DF;">{y}%</span> <br/> <span style="font-weight:bold;color:#999">Current Humidity</span></div>'
        }
    }],
    credits: {
        enabled: false
    },
});

// Initialize Temperature Chart
temperatureChart = Highcharts.chart('temperatureChart', {
    chart: {
        type: 'solidgauge',
        margin: [0, 0, 0, 0],
        backgroundColor: 'transparent'
    },
    title: null,
    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickWidth: 0,
        // tickPositions: [0, 100],
        tickmarkPlacement: 'between',
        minorTickLength: 0,
        // labels: {
        //     enabled: true,
        //     x: 0,
        //     y: 25,
        //     style: {
        //         color: '#999',
        //     }
        // },
    },
    pane: {
        size: '100%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 360,
        background: {
            borderWidth: 20,
            backgroundColor: '#EAEAFD',
            shape: 'arc',
            borderColor: '#EAEAFD',
            outerRadius: '90%',
            innerRadius: '90%'
        }
    },
    tooltip: {
        enabled: false
    },
    plotOptions: {
        solidgauge: {
            borderColor: '#FF5757',
            borderWidth: 15,
            radius: 90,
            innerRadius: '90%',
            dataLabels: {
                y: -25,
                borderWidth: 0,
                useHTML: true
            }
        }
    },
    series: [{
        name: 'Temperature',
        data: [0], // Initial data placeholder
        dataLabels: {
            format: '<div style="text-align:center;"><span style="font-size:24px;color:#FF5757;">{y}°C</span> <br/> <span style="font-weight:bold;color:#999">Current Temperature</span></div>'
        }
    }],
    credits: {
        enabled: false
    },
});

export function loadChart() {
    fetchSoldDeceasedData();
    fetchExpenseIncome();
    fetchPigsData();
}

// Initialize 
updateCharts();
loadChart();
setInterval(updateCharts, 1000);

