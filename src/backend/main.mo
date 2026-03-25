import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type CateringCategory = {
    #wedding;
    #corporate;
    #festival;
    #birthday;
  };

  type PriceRange = {
    #budget;
    #standard;
    #premium;
  };

  public type CateringService = {
    name : Text;
    description : Text;
    category : CateringCategory;
    imageUrl : Text;
    phone : Text;
    priceRange : PriceRange;
    isActive : Bool;
    createdAt : Time.Time;
  };

  type Gender = {
    #male;
    #female;
    #other;
  };

  module Gender {
    public func compare(g1 : Gender, g2 : Gender) : Order.Order {
      switch (g1, g2) {
        case (#female, #female) { #equal };
        case (#female, _) { #less };
        case (#male, #female) { #greater };
        case (#male, #male) { #equal };
        case (#male, #other) { #less };
        case (#other, #other) { #equal };
        case (#other, _) { #greater };
      };
    };
  };

  public type MatrimonyProfile = {
    name : Text;
    age : Nat;
    gender : Gender;
    location : Text;
    education : Text;
    profession : Text;
    bio : Text;
    community : Text;
    imageUrl : Text;
    contactEmail : Text;
    isActive : Bool;
    createdAt : Time.Time;
  };

  type InquirySubject = {
    #catering;
    #matrimony;
    #general;
  };

  public type ContactInquiry = {
    name : Text;
    email : Text;
    phone : Text;
    subject : InquirySubject;
    message : Text;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  module MatrimonyProfile {
    public func compareByCommunityLocationGender(a : MatrimonyProfile, b : MatrimonyProfile) : Order.Order {
      switch (Text.compare(a.community, b.community)) {
        case (#equal) {
          switch (Text.compare(a.location, b.location)) {
            case (#equal) { Gender.compare(a.gender, b.gender) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  let cateringServices = Map.empty<Nat, CateringService>();
  let matrimonyProfiles = Map.empty<Nat, MatrimonyProfile>();
  let contactInquiries = Map.empty<Nat, ContactInquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextCateringId = 1;
  var nextMatrimonyId = 1;
  var nextInquiryId = 1;

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Catering Services
  public shared ({ caller }) func addCateringService(service : CateringService) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add catering services");
    };
    let newService : CateringService = {
      service with
      createdAt = Time.now();
      isActive = true;
    };
    cateringServices.add(nextCateringId, newService);
    nextCateringId += 1;
    nextCateringId - 1;
  };

  public shared ({ caller }) func updateCateringService(id : Nat, service : CateringService) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update catering services");
    };
    switch (cateringServices.get(id)) {
      case (null) { Runtime.trap("Catering service not found") };
      case (?existing) {
        cateringServices.add(
          id,
          {
            service with
            createdAt = existing.createdAt;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteCateringService(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete catering services");
    };
    cateringServices.remove(id);
  };

  public query func getAllActiveCateringServices() : async [CateringService] {
    cateringServices.values().toArray().filter(func(service) { service.isActive });
  };

  // Matrimony Profiles
  public shared ({ caller }) func addMatrimonyProfile(profile : MatrimonyProfile) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add matrimony profiles");
    };
    let newProfile : MatrimonyProfile = {
      profile with
      createdAt = Time.now();
      isActive = true;
    };
    matrimonyProfiles.add(nextMatrimonyId, newProfile);
    nextMatrimonyId += 1;
    nextMatrimonyId - 1;
  };

  public shared ({ caller }) func updateMatrimonyProfile(id : Nat, profile : MatrimonyProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update matrimony profiles");
    };
    switch (matrimonyProfiles.get(id)) {
      case (null) { Runtime.trap("Matrimony profile not found") };
      case (?existing) {
        matrimonyProfiles.add(
          id,
          {
            profile with
            createdAt = existing.createdAt;
          },
        );
      };
    };
  };

  public shared ({ caller }) func deleteMatrimonyProfile(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete matrimony profiles");
    };
    matrimonyProfiles.remove(id);
  };

  public query func getAllActiveMatrimonyProfiles() : async [MatrimonyProfile] {
    matrimonyProfiles.values().toArray().filter(func(profile) { profile.isActive });
  };

  public query func filterMatrimonyProfiles(community : ?Text, location : ?Text, gender : ?Gender) : async [MatrimonyProfile] {
    matrimonyProfiles
      .values()
      .toArray()
      .filter(
        func(profile) {
          let communityMatch = switch (community) {
            case (null) { true };
            case (?c) { Text.equal(profile.community, c) };
          };
          let locationMatch = switch (location) {
            case (null) { true };
            case (?l) { Text.equal(profile.location, l) };
          };
          let genderMatch = switch (gender) {
            case (null) { true };
            case (?g) { profile.gender == g };
          };
          profile.isActive and communityMatch and locationMatch and genderMatch;
        }
      )
      .sort(MatrimonyProfile.compareByCommunityLocationGender);
  };

  // Contact Inquiries
  public shared func submitContactInquiry(inquiry : ContactInquiry) : async Nat {
    let newInquiry : ContactInquiry = {
      inquiry with
      createdAt = Time.now();
    };
    contactInquiries.add(nextInquiryId, newInquiry);
    nextInquiryId += 1;
    nextInquiryId - 1;
  };

  public query ({ caller }) func getAllContactInquiries() : async [ContactInquiry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view contact inquiries");
    };
    contactInquiries.values().toArray();
  };
};
