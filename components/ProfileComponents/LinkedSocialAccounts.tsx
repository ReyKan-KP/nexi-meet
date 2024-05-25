const LinkedSocialAccounts: React.FC = () => (
  <div>
    <h2 className="text-lg font-bold text-black mb-2">
      Linked Social Accounts
    </h2>
    <div className="mb-4">
      <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 hover:text-black">
        Link LinkedIn
      </button>
    </div>
    <div className="mb-4">
      <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 hover:text-black">
        Link Facebook
      </button>
    </div>
    <div className="mb-4">
      <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 hover:text-black">
        Link Twitter
      </button>
    </div>
  </div>
);

export default LinkedSocialAccounts;