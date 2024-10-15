function isErrorByComfyUi(response) {
  console.log('isErrorByComfyUi response', JSON.stringify(response));
  
  // レスポンスの構造をチェック
  if (response && typeof response === 'object') {
      // プロンプトIDを取得（最初のキー）
      const promptId = Object.keys(response)[0];
      if (promptId && response[promptId] && response[promptId].status) {
          const status = response[promptId].status;
          const result = status.status_str === "error";
          console.log('isErrorByComfyUi return', result);
          return result;
      }
  }
  console.log('isErrorByComfyUi return false');
  return false;
}
function getErrorMessageByComfyUi(response) {
  console.log('getErrorMessageByComfyUi called with:', JSON.stringify(response));

  if (isErrorByComfyUi(response)) {
      const promptId = Object.keys(response)[0];
      const status = response[promptId].status;
      const errorMessage = {
          status_str: status.status_str || 'Unknown error',
          completed: status.completed,
          exception_type: 'Unknown',
          exception_message: 'An error occurred',
          traceback: []
      };

      if (Array.isArray(status.messages) && status.messages.length > 0) {
          const lastMessage = status.messages[status.messages.length - 1];
          if (Array.isArray(lastMessage) && lastMessage.length > 1 && typeof lastMessage[1] === 'object') {
              const errorDetails = lastMessage[1];
              errorMessage.exception_type = errorDetails.exception_type || errorMessage.exception_type;
              errorMessage.exception_message = errorDetails.exception_message || errorMessage.exception_message;
              errorMessage.traceback = Array.isArray(errorDetails.traceback) ? errorDetails.traceback : errorMessage.traceback;
          }
      }

      console.log('getErrorMessageByComfyUi returning:', errorMessage);
      return errorMessage;
  }
  console.log('getErrorMessageByComfyUi returning null');
  return null;
}