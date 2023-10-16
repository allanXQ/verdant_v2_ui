import { useSelector } from "react-redux";
import CreateForm from "../../../../utils/createForm";
import { selectActiveAsset } from "redux/features/app/appDataSlice";
import { useMediaQuery, useTheme } from "@mui/material";

const BuyModel = {
  name: "Buy",
  endpoint: "user/trade/spot/buy-limit",
  method: "post",
  variant: "outlined",

  fields: [
    {
      name: "assetName",
      type: "text",
      label: "Asset",
      placeholder: "asset name",
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

const BuyForm = ({ children }) => {
  const activeAsset = useSelector(selectActiveAsset);
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down("md"));

  BuyModel.sx = {
    width: mediaQuery ? "14rem" : "15rem",
  };
  BuyModel.buttonSx = {
    width: mediaQuery ? "14rem" : "15rem",
    borderRadius: "2px",
  };
  const updatedBuyModel = {
    ...BuyModel,
    fields: BuyModel.fields.map((field) =>
      field.name === "assetName" ? { ...field, value: activeAsset } : field
    ),
  };
  return CreateForm("Buy", updatedBuyModel, children, activeAsset);
};

export default BuyForm;
