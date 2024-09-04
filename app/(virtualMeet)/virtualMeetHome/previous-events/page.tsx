import CallList from "@components/VirtualMeetComponents/CallList";

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col text-sky-300">
      <h1 className="text-3xl font-bold">Previous Calls</h1>

      <CallList type="ended" />
    </section>
  );
};

export default PreviousPage;
