/**
 * Piano Preview Component (React)
 */
import type { PreviewComponentProps } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData } from "../core/types";
type PreviewProps = PreviewComponentProps<PianoToolData, PianoJsonData>;
export declare function Preview({ result }: PreviewProps): import("react/jsx-runtime").JSX.Element | null;
export default Preview;
