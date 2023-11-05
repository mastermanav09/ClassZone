const awakeToast = (type, message, toastId, toast) => {
  switch (type) {
    case "error":
      toast.error(message, {
        toastId: toastId,
      });
      break;

    case "success":
      toast.success(message, {
        toastId: toastId,
      });
      break;

    case "info":
      toast.info(message, {
        toastId: toastId,
      });
      break;

    default:
      break;
  }
};

const notifyAndUpdate = (toastId, type, message, toast, timeLimit) => {
  if (toast.isActive(toastId)) {
    toast.update(toastId);
  } else {
    toast.dismiss(toastId);
    awakeToast(type, message, toastId, toast);
  }

  if (timeLimit) {
    toast.update(toastId, {
      autoClose: timeLimit,
    });
  }
};

module.exports = {
  notifyAndUpdate,
};
