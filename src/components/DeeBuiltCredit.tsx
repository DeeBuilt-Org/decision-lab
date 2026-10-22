import { Typography } from "antd";

const { Link, Text } = Typography;

/** The "Made by DeeBuilt" credit in the rail foot, the mobile footer, and at the foot of the About and Privacy modals. */
export default function DeeBuiltCredit() {
  return (
    <Text type="secondary" className="dl-credit">
      Made by{" "}
      <Link href="https://deebuilt.co" target="_blank" rel="noopener noreferrer" className="dl-credit">
        DeeBuilt
      </Link>
    </Text>
  );
}
