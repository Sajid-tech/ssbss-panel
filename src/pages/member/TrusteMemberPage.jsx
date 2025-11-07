import MemberList from "../../components/MemberList/MemberList";

const TrusteMemberPage = () => {
  return (
    <div>
      <MemberList title="Trustee Members" userTypeFilter="Trustee" />
    </div>
  );
};

export default TrusteMemberPage;
