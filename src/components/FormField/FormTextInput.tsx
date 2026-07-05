import { ComponentProps } from "solid-js";
import { useFormField } from "./FormField";
import styles from "./FormTextInput.module.css";

interface Props extends ComponentProps<"input"> {}

export default function FormTextInput(props: Props) {
    const field = useFormField();
    return (
        <input {...props} class={styles.input} id={field.id} name={field.id} />
    );
}
