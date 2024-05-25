const PrivacySettings: React.FC = () => (
  <div>
    <h2 className="text-lg font-bold text-black mb-2">Privacy Settings</h2>
    <form>
      <div className="mb-4">
        <label className="block text-gray-700">Profile Visibility</label>
        <select className="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1">
          <option>Public</option>
          <option>Private</option>
          <option>Friends Only</option>
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
      >
        Update
      </button>
    </form>
  </div>
);

export default PrivacySettings;