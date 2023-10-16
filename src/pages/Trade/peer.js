import useUserData from "Hooks/useUserData";
import { MuiButton } from "components/common/Button";
import MainHistory from "pages/TransactionHistory/mainHistory";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiCall } from "redux/async/asyncThunk";
import { selectP2PTrades } from "redux/features/app/appDataSlice";

const ActionButton = ({ type }) => {
  const navigate = useNavigate();

  return (
    <MuiButton
      variant="contained"
      onClick={() => navigate(type.toLowerCase() === "sell" ? "/buy" : "/sell")} //replace with buy and sell modals
      content={type.toLowerCase() === "sell" ? "Buy" : "Sell"}
    />
  );
};

const columns = [
  { field: "Type", headerName: "Type", width: 210 },
  { field: "Asset", headerName: "Asset", width: 210 },
  { field: "Amount", headerName: "Amount", width: 210 },
  { field: "Price", headerName: "Price", width: 200 },
  {
    field: "action",
    headerName: "Action",
    width: 210,
    renderCell: (params) => {
      return <ActionButton type={params.row.Type} />;
    },
  },
];

const PeerTrading = () => {
  const dispatch = useDispatch();
  const userData = useUserData();

  useEffect(() => {
    dispatch(
      apiCall({ endpoint: "app/p2p-trades", method: "GET", slice: "appData" })
    );
  }, [dispatch]);

  const p2pTrades = useSelector(selectP2PTrades);

  const buttons = [
    {
      name: "Spot",
      path: "/trade/spot",
    },
    {
      name: "Swap",
      path: "/trade/swap",
    },
  ];

  const rows =
    Array.isArray(p2pTrades) &&
    p2pTrades.map((trade) => {
      const { orderType, assetName, amount, price } = trade;
      return {
        id: trade.orderId,
        Type: orderType === "buyp2p" ? "Buy" : "Sell",
        Asset: assetName,
        Amount: amount,
        Price: price,
      };
    });
  return (
    <MainHistory
      title="P2P"
      columns={columns}
      rows={rows}
      userInfo={{
        accountBalance: userData?.accountBalance,
        name: "Account Balance",
      }}
      buttons={buttons}
    />
  );
};

export default PeerTrading;
