import { Modal, Typography } from "antd";
import DeeBuiltCredit from "@/components/DeeBuiltCredit";

const { Paragraph, Title } = Typography;

export default function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Privacy" width={560}>
      <Title level={5} style={{ marginTop: 0 }}>
        Your answers stay with you
      </Title>
      <Paragraph>
        Decision Lab runs entirely in your browser. Your quiz answers are never uploaded or
        saved, and there is no account to create.
      </Paragraph>
      <DeeBuiltCredit />
    </Modal>
  );
}
