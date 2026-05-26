import axios from "@/shared/axios";
import uploadErrorMessage from "@/shared/uploadErrorMessage";

export default (file) => {
  const imageUploadUrl = "/creator/image/store";

  const form = new FormData();
  form.append("image", file);

  return axios
    .post(imageUploadUrl, form)
    .then((res) => {
      return `/storage/${res.data.image}`;
    })
    .catch((err) => {
      console.error(err);
      // Reject so the quill-image-uploader plugin surfaces the
      // failure inline instead of leaving a broken placeholder.
      return Promise.reject(new Error(uploadErrorMessage(err)));
    });
};
