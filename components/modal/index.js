import createModal from "./createModal"


import Confirm from "./Confirm";
import Prompt from "./Prompt";
import Toast from "./Toast";
import Alert from "./Alert";

import Confirm from "./Confirm"
import Options from "./Options";
import Prompt from "./Prompt";
import Notification from "./Notification";
import Marquee from "./Marquee";
import PreviewPhoto from "./PreviewPhoto";
import PreviewVideo from "./PreviewVideo";
export const confirm = createModal(Confirm);
export const msgConfirm = createModal(Confirm);

export const msgOptions = createModal(Options);
export const msgPrompt = createModal(Prompt);
export const msgMarquee = createModal(Marquee);
export const msgNotification = createModal(Notification);
export const msgPreviewPhoto = createModal(PreviewPhoto);
export const msgPreviewVideo = createModal(PreviewVideo);


export const msgAlert = createModal(Alert);
export const msgPrompt = createModal(Prompt);
export const msgToast = createModal(Toast);

