import { PickerCard } from "@/quizzes/platform-picker/components/PickerCard";
import "./home.css";

/**
 * Home: the quiz library. One card per ready-made quiz, two to a row on
 * desktop and one on phones. A new quiz adds its card here.
 */
export default function HomePage() {
  return (
    <ul className="dl-home-quizzes" aria-label="Quizzes">
      <li>
        <PickerCard />
      </li>
    </ul>
  );
}
