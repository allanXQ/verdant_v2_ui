import CreateForm from "../../../utils/createForm";
import FormStepper from "../../../utils/formStepper";

const DepositModel = {
  name: "Deposit",
  endpoint: "user/transact/mpesa/deposit",
  method: "post",
  isStepper: true,

  steps: [
    {
      title: "Step 1",
      fields: [
        {
          name: "phone",
          type: "number",
          label: "Mpesa number",
          placeholder: "2547...",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          label: "Amount",
          placeholder: "min 100",
          required: true,
        },
      ],
    },
    {
      title: "Confirm form details",
      confirmation: true,
      fields: [],
    },
    {
      title: "Submit form",
      submission: true,
      fields: [],
    },
  ],
};

const DepositForm = () => {
  return FormStepper("Deposit", DepositModel);
};

export default DepositForm;
