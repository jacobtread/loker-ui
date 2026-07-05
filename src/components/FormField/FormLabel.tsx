import { ParentProps } from "solid-js";
import { useFormField } from "./FormField";
import styles from "./FormLabel.module.css";

interface Props {}

export default function FormLabel(props: ParentProps<Props>) {
    const field = useFormField();
    return (
        <label for={field.id} class={styles.label}>
            {props.children}
        </label>
    );
}
