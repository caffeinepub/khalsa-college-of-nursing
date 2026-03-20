import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

actor {
  // Contact Form Submission
  type ContactSubmission = {
    name : Text;
    email : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let contactSubmissions = List.empty<ContactSubmission>();

  public shared ({ caller }) func submitContactForm(
    name : Text,
    email : Text,
    phone : Text,
    subject : Text,
    message : Text,
  ) : async () {
    let submission : ContactSubmission = {
      name;
      email;
      phone;
      subject;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(submission);
  };

  public shared ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    contactSubmissions.toArray();
  };

  // News and Events
  type NewsEvent = {
    title : Text;
    description : Text;
    date : Time.Time;
    category : NewsCategory;
    isActive : Bool;
  };

  type NewsCategory = {
    #news;
    #event;
  };

  let newsEvents = List.empty<NewsEvent>();

  public shared ({ caller }) func addNewsEvent(
    title : Text,
    description : Text,
    date : Time.Time,
    category : NewsCategory,
  ) : async () {
    let newsEvent : NewsEvent = {
      title;
      description;
      date;
      category;
      isActive = true;
    };
    newsEvents.add(newsEvent);
  };

  public shared ({ caller }) func toggleNewsEventStatus(index : Nat) : async () {
    if (index >= newsEvents.size()) {
      Runtime.trap("Invalid news event index");
    };

    let newsEventsArray = newsEvents.toArray();
    newsEvents.clear();

    var i = 0;
    while (i < newsEventsArray.size()) {
      if (i == index) {
        let updatedEvent = {
          title = newsEventsArray[i].title;
          description = newsEventsArray[i].description;
          date = newsEventsArray[i].date;
          category = newsEventsArray[i].category;
          isActive = not newsEventsArray[i].isActive;
        };
        newsEvents.add(updatedEvent);
      } else {
        newsEvents.add(newsEventsArray[i]);
      };
      i += 1;
    };
  };

  public shared ({ caller }) func getActiveNewsEvents() : async [NewsEvent] {
    let activeEvents = newsEvents.filter(func(event) { event.isActive });
    activeEvents.toArray();
  };

  // Notices/Announcements
  type Notice = {
    title : Text;
    content : Text;
    date : Time.Time;
    isImportant : Bool;
  };

  let notices = List.empty<Notice>();

  public shared ({ caller }) func addNotice(title : Text, content : Text, isImportant : Bool) : async () {
    let notice : Notice = {
      title;
      content;
      date = Time.now();
      isImportant;
    };
    notices.add(notice);
  };

  public shared ({ caller }) func getAllNotices() : async [Notice] {
    notices.toArray();
  };

  // Admission Enquiries
  type AdmissionEnquiry = {
    applicantName : Text;
    email : Text;
    phone : Text;
    programOfInterest : Text;
    timestamp : Time.Time;
  };

  let admissionEnquiries = List.empty<AdmissionEnquiry>();

  public shared ({ caller }) func submitAdmissionEnquiry(
    applicantName : Text,
    email : Text,
    phone : Text,
    programOfInterest : Text,
  ) : async () {
    let enquiry : AdmissionEnquiry = {
      applicantName;
      email;
      phone;
      programOfInterest;
      timestamp = Time.now();
    };
    admissionEnquiries.add(enquiry);
  };

  public shared ({ caller }) func getAllAdmissionEnquiries() : async [AdmissionEnquiry] {
    admissionEnquiries.toArray();
  };
};
