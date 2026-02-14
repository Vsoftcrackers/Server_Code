import React from 'react'
import { User, Phone, Plus } from 'lucide-react'

const ClientInformation = ({
  formData,
  handleInputChange,
  handleClientNameChange,
  selectClient,
  clientSuggestions,
  showClientSuggestions,
  setShowClientSuggestions,
  setShowClientModal
}) => {
  return (
    <div className="mb-4 sm:mb-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm sm:text-xl font-bold text-gray-800 flex-shrink truncate">
            Client Information
          </h2>
          <button 
            type="button"
            onClick={() => setShowClientModal(true)}
            className="text-[10px] sm:text-sm font-semibold text-black bg-[#ffbe2a] px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Add </span>
            <span>Client</span>
          </button>
        </div>
        <div className="h-0.5 bg-[#ffbe2a] w-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 w-full max-w-full">
        {/* Client Name with Autocomplete */}
        <div className="relative w-full max-w-full">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleClientNameChange}
              onFocus={() => formData.clientName && setShowClientSuggestions(true)}
              onBlur={() => setTimeout(() => setShowClientSuggestions(false), 300)}
              placeholder="Start typing..."
              className="w-full max-w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
              required
            />
          </div>
          
          {/* Client Suggestions Dropdown */}
          {showClientSuggestions && formData.clientName && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md sm:rounded-lg shadow-lg max-h-40 sm:max-h-60 overflow-y-auto">
              {clientSuggestions.length > 0 ? (
                clientSuggestions.map((client, index) => (
                  <div
                    key={client.id || index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectClient(client);
                    }}
                    className="px-2 sm:px-4 py-1.5 sm:py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-semibold text-xs sm:text-base text-gray-800 break-words overflow-hidden">
                      {client.clientName}
                    </div>
                    {client.clientPhone && (
                      <div className="text-[10px] sm:text-sm text-gray-600">
                        {client.clientPhone}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-2 sm:px-4 py-3 sm:py-6 text-center">
                  <p className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-3">
                    No client found
                  </p>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowClientModal(true);
                      setShowClientSuggestions(false);
                    }}
                    className="inline-flex items-center gap-1 sm:gap-2 bg-[#ffbe2a] text-black px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg font-semibold hover:opacity-90 transition-opacity text-[10px] sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Add Client
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Client GST Number */}
        <div className="w-full max-w-full">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1">
            Client GST Number
          </label>
          <input
            type="text"
            name="clientGST"
            value={formData.clientGST}
            onChange={handleInputChange}
            placeholder="29XXXXXX..."
            className="w-full max-w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
            readOnly
          />
        </div>

        {/* Client Address */}
        <div className="w-full max-w-full">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1">
            Client Address
          </label>
          <textarea
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleInputChange}
            rows="2"
            placeholder="Client Address"
            className="w-full max-w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none resize-none"
            readOnly
          />
        </div>

        {/* Company Name */}
        <div className="w-full max-w-full">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Company Name"
            className="w-full max-w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
            readOnly
          />
        </div>

        {/* Client Phone */}
        <div className="w-full max-w-full">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1">
            Client Phone
          </label>
          <div className="relative w-full">
            <Phone className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-5 sm:h-5 pointer-events-none" />
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleInputChange}
              placeholder="+91 XXXXX..."
              className="w-full max-w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
              readOnly
            />
          </div>
        </div>

        {/* Client Email */}
        <div className="w-full max-w-full">
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-1">
            Client Email
          </label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleInputChange}
            placeholder="client@example.com"
            className="w-full max-w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#ffbe2a] focus:border-transparent outline-none"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}

export default ClientInformation