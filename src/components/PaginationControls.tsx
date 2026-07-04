import { Accessor } from "solid-js";
import styles from "./PaginationControls.module.css";

interface Props {
    page: Accessor<number>;
    hasNextPage: Accessor<boolean>;

    onPrevious(): void;
    onNext(): void;

    disabled?: Accessor<boolean>;
}

export default function PaginationControls({
    page,
    hasNextPage,
    onPrevious,
    onNext,
    disabled = () => false,
}: Props) {
    return (
        <div class={styles.pagination}>
            <button onclick={onPrevious} disabled={page() === 0 || disabled()}>
                Previous
            </button>

            <div class={styles.page}>Page {page() + 1}</div>

            <button onclick={onNext} disabled={!hasNextPage() || disabled()}>
                Next
            </button>
        </div>
    );
}
