import { Route, Routes } from "react-router-dom";
import AppInitializer from "./components/AppInitializer";
import MaintenancePage from "./components/common/MaintenancePage";
import MemberForm from "./components/MemberList/MemberForm";
import ProtectedLayout from "./components/ProtectedLayout";
import VersionCheck from "./components/VersionCheck";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SignIn from "./pages/auth/SignIn";
import EventAttendMember from "./pages/event/EventAttendMember";
import EventList from "./pages/event/EventList";
import EvenRegisterList from "./pages/eventregister/EventRegisterList";
import EventDetailsPage from "./pages/eventtrack/EventDetailsPage";
import EventTrackList from "./pages/eventtrack/EventTrackList";
import Dashboard from "./pages/home/Dashboard";
import CoupleMembersPage from "./pages/member/CoupleMembersPage";
import LifeMembersPage from "./pages/member/LifeMembersPage";
import TrusteMemberPage from "./pages/member/TrusteMemberPage";
import NewRegisterationForm from "./pages/newRegisteration/NewRegisterationForm";
import NewRegisterationList from "./pages/newRegisteration/NewRegisterationList";
import EventDetailsReport from "./pages/report/EventDetailsReport/EventDetailsReport";
import EventReport from "./pages/report/EventReport/EventReport";
import CoupleMemberReport from "./pages/report/MemberReport/CoupleMemberReport";
import LifeMemberReport from "./pages/report/MemberReport/LifeMemberReport";
import TrusteeMemberReport from "./pages/report/MemberReport/TrusteeMemberReport";
import NotRegisterNotScanned from "./pages/report/NotregisteredNotScanned/NotRegisterNotScanned";
import RegisteredNotScanned from "./pages/report/registerednotscanned/RegisteredNotScanned";
import AllMember from "./pages/member/AllMember";

// import { Route, Routes } from "react-router-dom";
// import AppInitializer from "./components/AppInitializer";
// import MaintenancePage from "./components/common/MaintenancePage";
// import MemberForm from "./components/MemberList/MemberForm";
// import ProtectedLayout from "./components/ProtectedLayout";
// import VersionCheck from "./components/VersionCheck";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import SignIn from "./pages/auth/SignIn";
// import DeliveryList from "./pages/delivery/DeliveryList";
// import EventAttendMember from "./pages/event/EventAttendMember";
// import EventList from "./pages/event/EventList";
// import EvenRegisterList from "./pages/eventregister/EventRegisterList";
// import EventDetailsPage from "./pages/eventtrack/EventDetailsPage";
// import EventTrackList from "./pages/eventtrack/EventTrackList";
// import GuestUserList from "./pages/guestuser/GuestUserList";
// import GuestUserOrderForm from "./pages/guestuserorder/GuestUserOrderForm";
// import GuestUserOrderList from "./pages/guestuserorder/GuestUserOrderList";
// import Dashboard from "./pages/home/Dashboard";
// import CoupleMembersPage from "./pages/member/CoupleMembersPage";
// import LifeMembersPage from "./pages/member/LifeMembersPage";
// import TrusteMemberPage from "./pages/member/TrusteMemberPage";
// import NewRegisterationForm from "./pages/newRegisteration/NewRegisterationForm";
// import NewRegisterationList from "./pages/newRegisteration/NewRegisterationList";
// import Notification from "./pages/notification/Notification";
// import OrderForm from "./pages/order/OrderForm";
// import OrderList from "./pages/order/OrderList";
// import ProductForm from "./pages/product/ProductForm";
// import ProductList from "./pages/product/ProductList";
// import UserPage from "./pages/profile/Profile";
// import EventDetailsReport from "./pages/report/EventDetailsReport/EventDetailsReport";
// import EventReport from "./pages/report/EventReport/EventReport";
// import CoupleMemberReport from "./pages/report/MemberReport/CoupleMemberReport";
// import LifeMemberReport from "./pages/report/MemberReport/LifeMemberReport";
// import TrusteeMemberReport from "./pages/report/MemberReport/TrusteeMemberReport";
// import NotRegisterNotScanned from "./pages/report/NotregisteredNotScanned/NotRegisterNotScanned";
// import OrderReport from "./pages/report/Orderreport/Orderreport";
// import ProductCategoryReport from "./pages/report/ProductCategoryReport/ProductCategoryReport";
// import ProductReport from "./pages/report/ProductReport/ProductReport";
// import RegisteredNotScanned from "./pages/report/registerednotscanned/RegisteredNotScanned";
// import SecurityList from "./pages/security/SecurityList";
// import SliderList from "./pages/slider/SliderList";
// import StaffList from "./pages/staff/StaffList";
// import UserForm from "./pages/user/UserForm";
// import UserList from "./pages/user/UserList";
// import WebsiteEnquiry from "./pages/websiteenquiry/WebsiteEnquiry";

function App() {
  return (
    <AppInitializer>
      <VersionCheck />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/maintenance" element={<MaintenancePage />} />

        {/* Protected Routes: All other paths */}
        <Route
          path="*"
          element={
            <ProtectedLayout>
              <Routes>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/event" element={<EventList />} />
                <Route
                  path="/event-attend-member/:id"
                  element={<EventAttendMember />}
                />
                <Route path="/event-register" element={<EvenRegisterList />} />
                <Route path="/event-track" element={<EventTrackList />} />
                <Route
                  path="/new-registration-list"
                  element={<NewRegisterationList />}
                />
                <Route
                  path="/new-registration-form/:newId"
                  element={<NewRegisterationForm />}
                />
                <Route path="/member" element={<AllMember />} />
                <Route path="/life-member" element={<LifeMembersPage />} />
                <Route path="/couple-member" element={<CoupleMembersPage />} />
                <Route path="/truste-member" element={<TrusteMemberPage />} />
                <Route
                  path="/members/edit/:memberId"
                  element={<MemberForm />}
                />
                <Route path="/event-details" element={<EventDetailsPage />} />
                <Route
                  path="/report-life-member"
                  element={<LifeMemberReport />}
                />
                <Route
                  path="/report-couple-member"
                  element={<CoupleMemberReport />}
                />
                <Route
                  path="/report-truste-member"
                  element={<TrusteeMemberReport />}
                />
                <Route path="/report-event" element={<EventReport />} />
                <Route
                  path="/report-event-details"
                  element={<EventDetailsReport />}
                />
                <Route
                  path="/report-register-notscanned"
                  element={<RegisteredNotScanned />}
                />
                <Route
                  path="/report-notregister-notscanned"
                  element={<NotRegisterNotScanned />}
                />

                {/* ////////////////////// */}
                {/* 
                <Route path="/user-form" element={<UserPage />} />
                <Route path="/user-create" element={<UserForm />} />
                <Route path="/user-edit/:id" element={<UserForm />} />
                <Route path="/user" element={<UserList />} />
                <Route path="/security" element={<SecurityList />} />
                <Route path="/staff" element={<StaffList />} />
                <Route path="/delivery" element={<DeliveryList />} />
                <Route path="/slider" element={<SliderList />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/order" element={<OrderList />} />
                <Route path="/order-form" element={<OrderForm />} />
                <Route path="/order-form/:id" element={<OrderForm />} />
                <Route path="/guest-user" element={<GuestUserList />} />
                <Route
                  path="/guest-user-order"
                  element={<GuestUserOrderList />}
                />
                <Route
                  path="/guest-order-form"
                  element={<GuestUserOrderForm />}
                />
                <Route
                  path="/guest-order-form/:id"
                  element={<GuestUserOrderForm />}
                />

                <Route path="/product" element={<ProductList />} />
                <Route path="/product-create" element={<ProductForm />} />
                <Route path="/product-edit/:id" element={<ProductForm />} />
                <Route path="/website-enquiry" element={<WebsiteEnquiry />} />
                <Route path="/report-order" element={<OrderReport />} />

                <Route path="/report-product" element={<ProductReport />} />
                <Route
                  path="/report-product-category"
                  element={<ProductCategoryReport />}
                /> */}

                {/* Add more protected routes here */}
              </Routes>
            </ProtectedLayout>
          }
        />
      </Routes>
    </AppInitializer>
  );
}
export default App;
