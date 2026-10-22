import { Modal, Typography } from "antd";
import DeeBuiltCredit from "@/components/DeeBuiltCredit";

const { Paragraph, Title } = Typography;

export default function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="About Decision Lab" width={560}>
      <Title level={5} style={{ marginTop: 0 }}>
        A free tool from DeeBuilt
      </Title>
      <Paragraph>
        Decision Lab holds short quizzes that each answer one business question. The Platform
        Picker asks 20 questions and ranks seven work management platforms against your answers.
      </Paragraph>
      <Paragraph>
        There's no AI in the scoring, on purpose. Same answers, same result, every time.
      </Paragraph>
      <Paragraph type="secondary">Your answers never leave your browser.</Paragraph>
      <DeeBuiltCredit />
    </Modal>
  );
}
