import axios from "@/shared/axios";

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
    });
};
