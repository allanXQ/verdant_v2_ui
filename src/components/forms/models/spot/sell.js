import { useSelector } from "react-redux";
import CreateForm from "../../../../utils/createForm";
import { selectActiveAsset } from "redux/features/app/appDataSlice";
import { useTheme } from "@mui/material";

const SellModel = {
  name: "Sell",
  endpoint: "user/trade/spot/sell-limit",
  method: "post",
  variant: "outlined",
  sx: {
    width: "15rem",
  },
  buttonSx: {
    width: "15rem",
    borderRadius: "2px",
  },

  fields: [
    {
      name: "assetName",
      type: "text",
      label: "Asset",
      placeholder: "asset name",
      required: true,
    },
    {
      name: "amount",
      type: "number",
      label: "Amount",
      placeholder: "min 1",
      required: true,
    },
  ],
};

const SellForm = ({ children }) => {
  const activeAsset = useSelector(selectActiveAsset);
  const theme = useTheme();
  SellModel.sx = {
    width: theme.breakpoints.down("md") ? "14rem" : "15rem",
  };
  SellModel.buttonSx = {
    width: theme.breakpoints.down("md") ? "14rem" : "15rem",
    borderRadius: "2px",
  };
  const updatedSellModel = {
    ...SellModel,
    fields: SellModel.fields.map((field) =>
      field.name === "assetName" ? { ...field, value: activeAsset } : field
    ),
  };

  return CreateForm("Sell", updatedSellModel, children, activeAsset);
};

export default SellForm;
