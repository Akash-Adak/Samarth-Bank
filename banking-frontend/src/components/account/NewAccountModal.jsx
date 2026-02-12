import { useState } from "react";
import Modal from "../../components/Modal";
import { accountTypes } from "../../config/accountsConfig";

export default function NewAccountModal({
  open,
  onClose,
  newAccountType,
  setNewAccountType,
  createAccount
}) {

  // ================= STATE =================

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    docType: "",
    docNumber: ""
  });

 

  // ================= HELPERS =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };




  const validateStep1 = () => {
    return !!newAccountType;
  };


  const validateStep2 = () => {
    return (
      formData.fullname &&
      formData.dob &&
      formData.docType &&
      formData.docNumber 
    );
  };


  const handleSubmit = () => {

    if (!validateStep2()) {
      alert("Please complete all KYC details");
      return;
    }

    createAccount({
      type: newAccountType,
      ...formData,
    });

  };


  const handleClose = () => {

    setStep(1);

    setFormData({
      fullname: "",
      dob: "",
      docType: "",
      docNumber: ""
    });

    onClose();
  };


  if (!open) return null;


  // ================= UI =================

  return (
    <Modal open={open} onClose={handleClose}>

      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">


        {/* ================= HEADER ================= */}

        <div className="border-b px-5 py-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Open New Account
          </h2>

          <p className="text-sm text-gray-500">
            Step {step} of 2
          </p>

        </div>


        {/* ================= PROGRESS ================= */}

        <div className="h-1 bg-gray-200">

          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />

        </div>


        {/* ================= CONTENT ================= */}

        <div className="p-5 space-y-4">


          {/* ================= STEP 1 ================= */}

          {step === 1 && (

            <>

              <h3 className="font-medium text-gray-800 mb-2">
                Select Account Type
              </h3>

              <div className="space-y-2">

                {Object.entries(accountTypes).map(([key, config]) => (

                  <div
                    key={key}
                    onClick={() => setNewAccountType(key)}
                    className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
                      newAccountType === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >

                    <div>

                      <p className="font-medium text-sm">
                        {config.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {config.description}
                      </p>

                    </div>

                    {newAccountType === key && (
                      <span className="text-blue-600 text-sm font-semibold">
                        ✓
                      </span>
                    )}

                  </div>
                ))}

              </div>

            </>
          )}


          {/* ================= STEP 2 ================= */}

          {step === 2 && (

            <>

              <h3 className="font-medium text-gray-800 mb-2">
              Other Details
              </h3>


              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />


              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />


              <select
                name="docType"
                value={formData.docType}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">Document Type</option>
                <option value="AADHAAR">Aadhaar</option>
                <option value="PAN">PAN</option>
              </select>


              <input
                type="text"
                name="docNumber"
                placeholder="Document Number"
                value={formData.docNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />

            </>
          )}

        </div>


        {/* ================= FOOTER ================= */}

        <div className="flex gap-3 px-5 py-4 border-t">


          {/* Back */}
          {step === 2 && (

            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 py-2 rounded-lg text-gray-700"
            >
              Back
            </button>
          )}


          {/* Next / Submit */}
          <button
            onClick={() => {

              if (step === 1) {

                if (!validateStep1()) {
                  alert("Select account type");
                  return;
                }

                setStep(2);

              } else {
                handleSubmit();
              }
            }}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {step === 1 ? "Next" : "Create Account"}
          </button>

        </div>

      </div>

    </Modal>
  );
}
