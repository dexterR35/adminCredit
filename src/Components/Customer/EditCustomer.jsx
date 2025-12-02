import React, { useState, useEffect } from "react";
import { Modal } from "../Modal/useModal";
import { CustomButton } from "../Buttons/Buttons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const EditCustomer = ({ customer, isOpen, onClose, onUpdate, updateCustomer }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    selectedDate: "",
    aboutUs: "",
    bankHistory: false,
    bankStatus: false,
    banks: [],
    ifn: [],
    others: [],
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOriginalData = async () => {
      if (customer && customer.id) {
        try {
          // Fetch original data from Firestore to avoid React elements
          const docRef = doc(db, "oc_data", customer.id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const originalData = docSnap.data();
            const formData = originalData.customer_info?.formData || {};
            const bankingInfo = originalData.customer_info?.banking_info || {};
            
            setFormData({
              name: formData.name || "",
              phone: formData.phone || "",
              email: formData.email || "",
              selectedDate: formData.selectedDate || "",
              aboutUs: formData.aboutUs || "",
              bankHistory: bankingInfo.bankHistory === true || bankingInfo.bankHistory === false ? bankingInfo.bankHistory : false,
              bankStatus: originalData.customer_info?.banking_status === true,
              banks: Array.isArray(bankingInfo.banks) ? bankingInfo.banks : [],
              ifn: Array.isArray(bankingInfo.ifn) ? bankingInfo.ifn : [],
              others: Array.isArray(bankingInfo.others) ? bankingInfo.others : [],
              status: originalData.customer_status || "",
            });
          } else {
            // Fallback to formatted data if document doesn't exist
            setFormData({
              name: customer.name || "",
              phone: customer.phone || "",
              email: customer.email || "",
              selectedDate: customer.selectedDate || "",
              aboutUs: customer.aboutUs || "",
              bankHistory: customer.bankHistory === "Bank history",
              bankStatus: customer.bankStatus === "Negativ Raport",
              banks: [],
              ifn: [],
              others: [],
              status: customer.status || "",
            });
          }
        } catch (error) {
          console.error("Error fetching original customer data:", error);
          // Fallback to formatted data on error
          setFormData({
            name: customer.name || "",
            phone: customer.phone || "",
            email: customer.email || "",
            selectedDate: customer.selectedDate || "",
            aboutUs: customer.aboutUs || "",
            bankHistory: customer.bankHistory === "Bank history",
            bankStatus: customer.bankStatus === "Negativ Raport",
            banks: [],
            ifn: [],
            others: [],
            status: customer.status || "",
          });
        }
      }
    };
    
    fetchOriginalData();
  }, [customer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data to match Firestore structure
      const updatedData = {
        customer_info: {
          formData: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            selectedDate: formData.selectedDate,
            aboutUs: formData.aboutUs,
          },
          banking_info: {
            bankHistory: formData.bankHistory,
            banks: formData.banks,
            ifn: formData.ifn,
            others: formData.others,
          },
          banking_status: formData.bankStatus,
        },
        customer_status: formData.status,
      };

      await updateCustomer(customer.id, updatedData);
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Customer">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Job Date
              </label>
              <input
                type="text"
                name="selectedDate"
                value={formData.selectedDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Banks (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.banks) ? formData.banks.join(", ") : ""}
                onChange={(e) => handleArrayChange("banks", e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Bank1, Bank2, Bank3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                IFN (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.ifn) ? formData.ifn.join(", ") : ""}
                onChange={(e) => handleArrayChange("ifn", e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="IFN1, IFN2, IFN3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Others (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.others) ? formData.others.join(", ") : ""}
                onChange={(e) => handleArrayChange("others", e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Other1, Other2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="new">New</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              About Us
            </label>
            <textarea
              name="aboutUs"
              value={formData.aboutUs}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bankHistory"
                checked={formData.bankHistory}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-300">Has Bank History</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bankStatus"
                checked={formData.bankStatus}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-300">Negative Report</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <CustomButton
              text="Cancel"
              buttonType="default"
              onClick={onClose}
              type="button"
            />
            <CustomButton
              text={loading ? "Updating..." : "Update Customer"}
              buttonType="submit"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </Modal>
  );
};

export default EditCustomer;

