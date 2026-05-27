import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignupRole from "./pages/SignupRole.jsx";
import SignupDetails from "./pages/SignupDetails.jsx";
import Profile from "./pages/Profile.jsx";
import MyProfile from "./pages/Freelancer/MyProfile.jsx";
import Skills from "./pages/Freelancer/Skills.jsx";
import SkillTest from "./pages/Freelancer/SkillTest.jsx";
import PortfolioGallery from "./pages/Freelancer/PhotoGalley.jsx";
import SubmitProposals from "./pages/Freelancer/SubmitProposals.jsx";
import Reviews from "./pages/Freelancer/Reviews.jsx";
import Earnings from "./pages/Freelancer/Earnings.jsx";
import ActiveContracts from "./pages/Freelancer/ActiveContracts.jsx";
import BrowseProjects from "./pages/Freelancer/BrowseProjects.jsx";
import ClientProfile from "./pages/Client/ClientProfile.jsx";
import PostProject from "./pages/Client/PostProject.jsx";
import ViewProposals from "./pages/Client/ViewProposals.jsx";
import RateReview from "./pages/Client/RateReview.jsx";
import SavedFreelancers from "./pages/Client/SavedFreelancers.jsx";
import Feed from "./pages/Community/Feed.jsx";
import Mentoring from "./pages/Community/Mentoring.jsx";
import MyMentorshipSessions from "./pages/Community/MyMentorshipSessions.jsx";
import MyPosts from "./pages/Community/MyPosts.jsx";
import MySkillChallenges from "./pages/Community/MySkillChallenges.jsx";
import SkillChallenges from "./pages/Community/SkillChallenges.jsx";
import Payments from "./pages/Payments.jsx";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup-role" element={<SignupRole />} />
      <Route path="/signup-details" element={<SignupDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/freelancer/profile" element={<MyProfile />} />
      <Route path="/freelancer/skills" element={<Skills />} />
      <Route path="/freelancer/skills/test/:skillName" element={<SkillTest />} />
      <Route path="/freelancer/portfolio" element={<PortfolioGallery />} />
      <Route path="/freelancer/submit-proposal" element={<SubmitProposals />} />
      <Route path="/freelancer/reviews" element={<Reviews />} />
      <Route path="/freelancer/earnings" element={<Earnings />} />
      <Route path="/freelancer/browse-projects" element={<BrowseProjects />} />
      <Route path="/freelancer/active-contracts" element={<ActiveContracts />} />
      <Route path="/client/profile" element={<ClientProfile />} />
      <Route path="/client/post-project" element={<PostProject />} />
      <Route path="/client/view-proposals" element={<ViewProposals />} />
      <Route path="/client/rate-review" element={<RateReview />} />
      <Route path="/client/saved-freelancers" element={<SavedFreelancers />} />
      <Route path="/community/feed" element={<Feed />} />
      <Route path="/community/challenges" element={<SkillChallenges/>} />
      <Route path="/community/mentoring" element={<Mentoring />}/>
      <Route path="/community/my-mentorships" element ={<MyMentorshipSessions />} />
      <Route path="/community/my-challenges" element = {<MySkillChallenges />} />
      <Route path="/community/my-posts" element={<MyPosts />} />
      <Route path="/payments" element={<Payments />} />
    </Routes>
  );
}