/**
 * Piano View Component (React)
 */
import type { ViewComponentProps } from "gui-chat-protocol";
import type { PianoToolData, PianoJsonData } from "../core/types";
type ViewProps = ViewComponentProps<PianoToolData, PianoJsonData>;
export declare function View({ selectedResult }: ViewProps): import("react/jsx-runtime").JSX.Element | null;
export default View;
