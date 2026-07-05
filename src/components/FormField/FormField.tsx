import { createContext, JSXElement, useContext } from "solid-js";
import styles from "./FormField.module.css";

interface Props {
    id: string;
    children?: JSXElement;
}

export interface FormFieldContextState {
    id: string;
}

export const FormFieldContext = createContext<FormFieldContextState>();

export function useFormField(): FormFieldContextState {
    const state = useContext(FormFieldContext);
    if (state === undefined)
        throw new Error(
            "cannot use form field component outside of <FormField/>",
        );
    return state;
}

export default function FormField(props: Props) {
    const formFieldState: FormFieldContextState = {
        id: props.id,
    };

    return (
        <FormFieldContext.Provider value={formFieldState}>
            <div class={styles.field}>{props.children}</div>
        </FormFieldContext.Provider>
    );
}
