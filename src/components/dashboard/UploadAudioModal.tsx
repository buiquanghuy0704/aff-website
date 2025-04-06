// import { Button, Form, Input, message, Modal, Upload } from "antd";
// import { UploadFile } from "antd/lib/upload/interface";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// import React from "react";
// import { v4 as uuidv4 } from "uuid";
// import { dataRef } from "../../firebase";

// interface IUploadAudioModal {
//   isModalOpen: boolean;
//   setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const UploadAudioModal = (props: IUploadAudioModal) => {
//   const { isModalOpen, setIsModalOpen } = props;
//   const [form] = Form.useForm();

//   const [imageFiles, setImageFiles] = React.useState<UploadFile[]>([]);
//   const [audioFiles, setAudioFiles] = React.useState<UploadFile[]>([]);

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const uploadImage = async (options: { file: any; }) => {
//     const { file } = options;

//     setImageFiles([file]);

//     const timeStamp = new Date();
//     const storage = getStorage();
//     const storageRef = ref(storage, "images/" + file?.name + "_" + timeStamp);

//     try {
//       const snapshot = await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       setImageFiles([
//         { status: "done", url: downloadURL, name: file?.name, uid: file.uid },
//       ]);
//     } catch (error) {
//       message.error("Xảy ra lỗi trong quá trình gửi ảnh");
//       console.error(error);
//     }
//   };
//   const uploadAudio = async (options: { file: UploadFile }) => {
//     const { file } = options;

//     setAudioFiles([file]);

//     const timeStamp = new Date();
//     const storage = getStorage();
//     const storageRef = ref(storage, "audios/" + file?.name + "_" + timeStamp);

//     try {
//       const snapshot = await uploadBytes(storageRef, file);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       setAudioFiles([
//         { status: "done", url: downloadURL, name: file?.name, uid: file.uid },
//       ]);
//     } catch (error) {
//       message.error("Xảy ra lỗi trong quá trình gửi file audio");
//       console.error(error);
//     }
//   };

//   const onCreateAudio = async () => {
//     console.log(imageFiles, audioFiles);

//     const payload = {
//       id: uuidv4(),
//       name: form.getFieldValue("name"),
//       description: form.getFieldValue("description"),
//       image: imageFiles[0].url,
//       path: audioFiles[0].url,
//     };

//     const musicRef = dataRef.ref(`musicList/${payload.id}`);

//     try {
//       await musicRef.set(payload);
//       form.resetFields();
//     } catch (error) {
//       console.error("Error creating audio item:", error);
//     }
//   };

//   return (
//     <Modal
//       title="Upload audio"
//       open={isModalOpen}
//       onOk={onCreateAudio}
//       onCancel={handleCancel}
//     >
//       <Form
//         layout={"vertical"}
//         form={form}
//         initialValues={{ layout: "verical" }}
//       >
//         <Form.Item label="Name" name="name">
//           <Input placeholder="Enter audio name" maxLength={30} showCount />
//         </Form.Item>
//         <Form.Item label="Description" name="description">
//           <Input
//             placeholder="Enter audio description"
//             maxLength={40}
//             showCount
//           />
//         </Form.Item>
//         <Form.Item name={"image"} label="Image">
//           <Upload
//             accept="image/*"
//             fileList={imageFiles}
//             customRequest={uploadImage}
//             maxCount={1}
//           >
//             <Button>Click to Upload</Button>
//           </Upload>
//         </Form.Item>
//         <Form.Item name={"audio"} label="Audio">
//           <Upload
//             accept="audio/*"
//             fileList={audioFiles}
//             customRequest={uploadAudio}
//             maxCount={1}
//           >
//             <Button>Click to Upload</Button>
//           </Upload>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default UploadAudioModal;
