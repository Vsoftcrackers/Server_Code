import React, { useState } from "react";
import { FileText, Building2, User, Calendar, DollarSign, Phone, MapPin, Hash, FileSignature } from "lucide-react";
import Navbar from '../../components/common/Navbar';
import SidePannel from '../../components/common/SidePannel';

const Billing = () => {
  const [formData, setFormData] = useState({
    // Bill Information
    billNumber: "",
    billDate: "",
    dueDate: "",
    
    // Company/Contractor Information
    companyName: "",
    companyAddress: "",
    companyGST: "",
    companyPhone: "",
    companyEmail: "",
    
    // Client Information
    clientName: "",
    clientAddress: "",
    clientGST: "",
    clientPhone: "",
    clientEmail: "",
    
    // Project Information
    projectName: "",
    projectLocation: "",
    workOrderNo: "",
    
    // Bill Items
    items: [{ 
      sno: 1,
      description: "", 
      unit: "Nos", 
      quantity: 0, 
      rate: 0, 
      amount: 0 
    }],
    
    // Additional Charges
    labourCharges: 0,
    transportCharges: 0,
    otherCharges: 0,
    otherChargesDescription: "",
    
    // Tax & Deductions
    cgst: 9,
    sgst: 9,
    igst: 0,
    tds: 2,
    retention: 0,
    
    // Payment Details
    advancePaid: 0,
    previousBills: 0,
    
    // Notes
    remarks: "",
    termsAndConditions: "",
  });

  const unitOptions = [
    "Nos", "Sqft", "Sqm", "Rft", "Rmt", "Cum", "Cft", 
    "Kg", "Ton", "Litre", "Day", "Month", "Lumpsum"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Calculate amount if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount =
        parseFloat(updatedItems[index].quantity || 0) *
        parseFloat(updatedItems[index].rate || 0);
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { 
        sno: prev.items.length + 1,
        description: "", 
        unit: "Nos", 
        quantity: 0, 
        rate: 0, 
        amount: 0 
      }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      // Update serial numbers
      updatedItems.forEach((item, idx) => {
        item.sno = idx + 1;
      });
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  };

  const calculateGrossAmount = () => {
    const subtotal = calculateSubtotal();
    const labour = parseFloat(formData.labourCharges || 0);
    const transport = parseFloat(formData.transportCharges || 0);
    const other = parseFloat(formData.otherCharges || 0);
    return subtotal + labour + transport + other;
  };

  const calculateCGST = () => {
    return (calculateGrossAmount() * parseFloat(formData.cgst || 0)) / 100;
  };

  const calculateSGST = () => {
    return (calculateGrossAmount() * parseFloat(formData.sgst || 0)) / 100;
  };

  const calculateIGST = () => {
    return (calculateGrossAmount() * parseFloat(formData.igst || 0)) / 100;
  };

  const calculateTotalWithTax = () => {
    return calculateGrossAmount() + calculateCGST() + calculateSGST() + calculateIGST();
  };

  const calculateTDS = () => {
    return (calculateTotalWithTax() * parseFloat(formData.tds || 0)) / 100;
  };

  const calculateRetention = () => {
    return (calculateTotalWithTax() * parseFloat(formData.retention || 0)) / 100;
  };

  const calculateNetPayable = () => {
    const total = calculateTotalWithTax();
    const tds = calculateTDS();
    const retention = calculateRetention();
    const advance = parseFloat(formData.advancePaid || 0);
    const previous = parseFloat(formData.previousBills || 0);
    return total - tds - retention - advance - previous;
  };

  const handleGenerateBill = () => {
    // Validation
    if (!formData.billNumber || !formData.billDate || !formData.clientName || !formData.projectName) {
      alert("Please fill in all required fields (Bill Number, Bill Date, Client Name, Project Name)");
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].description) {
      alert("Please add at least one bill item");
      return;
    }

    // Generate bill logic here
    console.log("Generating bill with data:", formData);
    alert("Bill generated successfully!");
    
    // You can add PDF generation or API call here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <Navbar />
      </nav>

      <aside className="fixed left-0 top-0 bottom-0 w-16 md:w-64 z-40 overflow-y-auto">
        <SidePannel />
      </aside>

      <div className="pt-20 pl-16 md:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-8 h-8 text-[#ffbe2a]" />
                <h1 className="text-3xl font-bold text-gray-800">Create Bill</h1>
              </div>
              <p className="text-gray-600">Generate professional bills for construction projects</p>
            </div>

            {/* Billing Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              
              {/* Bill Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Bill Information
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bill Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="billNumber"
                        value={formData.billNumber}
                        onChange={handleInputChange}
                        placeholder="INV-001"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bill Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="billDate"
                        value={formData.billDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Your Company Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your Company Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="companyGST"
                      value={formData.companyGST}
                      onChange={handleInputChange}
                      placeholder="29XXXXXXXXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Company Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="companyPhone"
                        value={formData.companyPhone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      placeholder="company@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Client Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Client/Company Name"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client GST Number
                    </label>
                    <input
                      type="text"
                      name="clientGST"
                      value={formData.clientGST}
                      onChange={handleInputChange}
                      placeholder="29XXXXXXXXXXXXX"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Address
                    </label>
                    <textarea
                      name="clientAddress"
                      value={formData.clientAddress}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Client Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Email
                    </label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleInputChange}
                      placeholder="client@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Project Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder="Project Name"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Work Order No.
                    </label>
                    <div className="relative">
                      <FileSignature className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="workOrderNo"
                        value={formData.workOrderNo}
                        onChange={handleInputChange}
                        placeholder="WO-001"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        name="projectLocation"
                        value={formData.projectLocation}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Project Site Address"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill Items */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Bill Items
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">S.No</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">Description of Work</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">Unit</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">Quantity</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">Rate</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">Amount</th>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-3 py-3 border text-center font-semibold">
                            {item.sno}
                          </td>
                          <td className="px-3 py-3 border">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, "description", e.target.value)}
                              placeholder="Work description"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                            />
                          </td>
                          <td className="px-3 py-3 border">
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                            >
                              {unitOptions.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3 border">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                              min="0"
                              step="0.01"
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                            />
                          </td>
                          <td className="px-3 py-3 border">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                              min="0"
                              step="0.01"
                              className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                            />
                          </td>
                          <td className="px-3 py-3 border">
                            <div className="flex items-center gap-1 text-gray-700 font-semibold">
                              ₹ {item.amount.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-3 py-3 border text-center">
                            <button
                              onClick={() => removeItem(index)}
                              disabled={formData.items.length === 1}
                              className={`px-3 py-1 text-xs rounded ${
                                formData.items.length === 1
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-red-500 text-white hover:bg-red-600"
                              }`}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={addItem}
                  className="mt-4 px-4 py-2 bg-[#ffbe2a] text-black font-semibold rounded-lg hover:bg-[#e5ab26] transition-colors"
                >
                  + Add Item
                </button>
              </div>

              {/* Additional Charges */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Additional Charges
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Labour Charges (₹)
                    </label>
                    <input
                      type="number"
                      name="labourCharges"
                      value={formData.labourCharges}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Transport Charges (₹)
                    </label>
                    <input
                      type="number"
                      name="transportCharges"
                      value={formData.transportCharges}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Other Charges (₹)
                    </label>
                    <input
                      type="number"
                      name="otherCharges"
                      value={formData.otherCharges}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Other Charges Description
                    </label>
                    <input
                      type="text"
                      name="otherChargesDescription"
                      value={formData.otherChargesDescription}
                      onChange={handleInputChange}
                      placeholder="Describe other charges"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tax & Deductions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Tax & Deductions
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CGST (%)
                    </label>
                    <input
                      type="number"
                      name="cgst"
                      value={formData.cgst}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="9"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SGST (%)
                    </label>
                    <input
                      type="number"
                      name="sgst"
                      value={formData.sgst}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="9"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      IGST (%)
                    </label>
                    <input
                      type="number"
                      name="igst"
                      value={formData.igst}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      TDS (%)
                    </label>
                    <input
                      type="number"
                      name="tds"
                      value={formData.tds}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Retention (%)
                    </label>
                    <input
                      type="number"
                      name="retention"
                      value={formData.retention}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Payment Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Advance Paid (₹)
                    </label>
                    <input
                      type="number"
                      name="advancePaid"
                      value={formData.advancePaid}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Previous Bills (₹)
                    </label>
                    <input
                      type="number"
                      name="previousBills"
                      value={formData.previousBills}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks and Terms */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#ffbe2a]">
                  Additional Information
                </h2>
                <div className="grid md:grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Remarks
                    </label>
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any special remarks or notes"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Enter payment terms and conditions"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-[#ffbe2a]">
                  Bill Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700 text-lg">
                    <span className="font-semibold">Subtotal (Items):</span>
                    <span className="font-bold">₹ {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {(formData.labourCharges > 0 || formData.transportCharges > 0 || formData.otherCharges > 0) && (
                    <>
                      {formData.labourCharges > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span className="pl-4">+ Labour Charges:</span>
                          <span>₹ {parseFloat(formData.labourCharges).toFixed(2)}</span>
                        </div>
                      )}
                      {formData.transportCharges > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span className="pl-4">+ Transport Charges:</span>
                          <span>₹ {parseFloat(formData.transportCharges).toFixed(2)}</span>
                        </div>
                      )}
                      {formData.otherCharges > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span className="pl-4">+ Other Charges:</span>
                          <span>₹ {parseFloat(formData.otherCharges).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-700 text-lg pt-2 border-t border-gray-300">
                        <span className="font-semibold">Gross Amount:</span>
                        <span className="font-bold">₹ {calculateGrossAmount().toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
                  {formData.cgst > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span className="pl-4">+ CGST ({formData.cgst}%):</span>
                      <span>₹ {calculateCGST().toFixed(2)}</span>
                    </div>
                  )}
                  {formData.sgst > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span className="pl-4">+ SGST ({formData.sgst}%):</span>
                      <span>₹ {calculateSGST().toFixed(2)}</span>
                    </div>
                  )}
                  {formData.igst > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span className="pl-4">+ IGST ({formData.igst}%):</span>
                      <span>₹ {calculateIGST().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-700 text-lg pt-2 border-t border-gray-300">
                    <span className="font-semibold">Total with Tax:</span>
                    <span className="font-bold">₹ {calculateTotalWithTax().toFixed(2)}</span>
                  </div>
                  
                  {formData.tds > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="pl-4">- TDS ({formData.tds}%):</span>
                      <span>₹ {calculateTDS().toFixed(2)}</span>
                    </div>
                  )}
                  {formData.retention > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="pl-4">- Retention ({formData.retention}%):</span>
                      <span>₹ {calculateRetention().toFixed(2)}</span>
                    </div>
                  )}
                  {formData.advancePaid > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="pl-4">- Advance Paid:</span>
                      <span>₹ {parseFloat(formData.advancePaid).toFixed(2)}</span>
                    </div>
                  )}
                  {formData.previousBills > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="pl-4">- Previous Bills:</span>
                      <span>₹ {parseFloat(formData.previousBills).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t-4 border-[#ffbe2a] pt-4 mt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span className="text-gray-900">Net Payable Amount:</span>
                      <span className="text-[#ffbe2a]">₹ {calculateNetPayable().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Bill Button */}
            <div className="flex justify-center pb-6">
              <button
                onClick={handleGenerateBill}
                className="px-12 py-4 bg-black text-white font-bold text-xl rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                Generate Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;