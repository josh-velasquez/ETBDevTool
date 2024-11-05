import { Typography } from "@mui/material";

interface ToolInfoProps {
  title: string;
  info: string;
}

const ToolInfo: React.FC<ToolInfoProps> = ({ title, info }) => {
  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        {info}
      </Typography>
    </>
  );
};
export default ToolInfo;
