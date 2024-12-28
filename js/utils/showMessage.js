
function showMessage(status, message, title) {
    toastr.options = {
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "timeOut": "15000",
    }
    if (status == "success") {
        toastr.success(message, title)
    } else if (status == "error") {
        toastr.error(message, title)
    } else if (status == "warning") {
        toastr.warning(message, title)
    } else {
        toastr.info(message, title)
    }

}
