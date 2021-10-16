import createModalCt from "./createModal"


import Confirm from "./Confirm";
import Prompt from "./Prompt";
import Toast from "./Toast";
import Alert from "./Alert";

import Options from "./Options";
import Notification from "./Notification";
import Marquee from "./Marquee";
import PreviewPhoto from "./PreviewPhoto";
import PreviewVideo from "./PreviewVideo";
export const confirm = createModalCt(Confirm);
export const msgConfirm = createModalCt(Confirm);

export const msgOptions = createModalCt(Options);
export const msgPrompt = createModalCt(Prompt);
export const msgMarquee = createModalCt(Marquee);
export const msgNotification = createModalCt(Notification);
export const msgPreviewPhoto = createModalCt(PreviewPhoto);
export const msgPreviewVideo = createModalCt(PreviewVideo);


export const msgAlert = createModalCt(Alert);
export const msgToast = createModalCt(Toast);
export const createModal = createModalCt;