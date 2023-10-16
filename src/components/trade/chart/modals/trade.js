import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import BuyForm from "components/forms/models/spot/buy";
import SellForm from "components/forms/models/spot/sell";

const style = {
  position: "relative",
  right: 0,
  bgcolor: "transparent",
  border: "none",
  boxShadow: "none",
};

const ModalComponent = ({ state, dispatch, title, FormComponent }) => {
  return (
    <Card sx={style}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <FormComponent />
      </CardContent>
    </Card>
  );
};

export const Buy = () => {
  return <ModalComponent title="Buy" FormComponent={BuyForm} />;
};

export const Sell = () => {
  return <ModalComponent title="Sell" FormComponent={SellForm} />;
};
