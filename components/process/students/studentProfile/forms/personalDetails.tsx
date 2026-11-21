import {
  Circle,
  GraduationCap,
  Home,
  MapPin,
  School,
  Square,
  Truck,
  User,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { ElementType } from "react";

// Updated interface to match the parent component's data structure
interface StudentData {
  student: {
    id: number;
    firstName: string;
    lastName?: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth: string | Date;
    community?: string;
    caste?: string;
    bloodGroup?: string;
    motherTongue?: string;
    religion?: string;
    aadharNo?: string;
    emisNo?: string;
    placeOfBirth?: string;
    country: string;
    state: string;
    cityTownVillage: string;
    address: string;
    communicationNo: string;
    phoneNo: string;
    email: string;
    relationName1: string;
    relationType1: string;
    relationNo1: string;
    relationName2?: string;
    relationType2?: string;
    relationNo2?: string;
    admissionNo: string;
    applicationNo?: string;
    rollNo: string;
  };
  currentEnrollment: {
    enrollmentDate: string | Date;
    academicYearId: number;
    branchId: number;
    classId: number;
    sectionId: number;
    section: string;
    class: string;
    academicYear: string;
    branchName: string;
    feeCategoryName: string;
    transportStatus: string;
    hostelStatus: string;
    joinYear: string;
    classJoin: string;
    admissionNo: string;
    applicationNo?: string;
    rollNo: string;
    status?: string;
  };
  transportDetails?: {
    transportAssignment: null | {
      route?: { routeName: string };
      stop?: { stopName: string };
    };
  };
  hostelDetails?: {
    hostelAssignment: null | {
      hostel: { hostelName: string };
      room: { floorNumber: string; roomNumber: string };
    };
  };
  studentFee: {
    totalFee: number;
    individualFee: number;
    finalFee: number;
    balanceAmount: number;
  };
}

export default function PersonalDetails({
  studentData,
}: {
  studentData: StudentData;
}) {
  const { student, currentEnrollment, transportDetails, hostelDetails } =
    studentData;

  return (
    <div className="min-h-screen bg-white mt-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-xl overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Circles */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute -right-8 -top-8"
          >
            <Circle className="w-32 h-32 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -left-8 -bottom-8"
          >
            <Circle className="w-24 h-24 text-white" />
          </motion.div>

          {/* Squares */}
          <motion.div
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="absolute right-1/4 bottom-0"
          >
            <Square className="w-16 h-16 text-white" />
          </motion.div>

          {/* Diagonal Lines */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.8 }}
              className="h-full w-full"
            >
              <div className="absolute transform rotate-45 left-0 right-0 top-0 h-px bg-white shadow-lg" />
              <div className="absolute transform -rotate-45 left-0 right-0 bottom-0 h-px bg-white shadow-lg" />
            </motion.div>
          </div>

          {/* Dots Pattern */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-8 gap-4 p-4"
            >
              {Array(16)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="w-1 h-1 rounded-full bg-white" />
                ))}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold text-white tracking-wide">
                STUDENT PROFILE
              </h1>
            </motion.div>

            <motion.p
              className="text-white text-lg opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {currentEnrollment.branchName}
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Border Design */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 md:col-span-4 lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="aspect-[4/3]">
                  <img
                    src="/api/placeholder/400/320"
                    alt="Student"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">{`${student.firstName} ${
                    student.lastName || ""
                  }`}</h3>
                  <p className="text-blue-100">
                    {currentEnrollment.classJoin || "N/A"}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex-1">
                    <p className="text-gray-500">Student ID</p>
                    <p className="font-medium">{student.id}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500">Roll No</p>
                    <p className="font-medium">{student.rollNo || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
              <InfoCard
                icon={School}
                title="Finance Details"
                fields={[
                  {
                    label: "Fee Category",
                    value: currentEnrollment.feeCategoryName || "N/A",
                  },
                ]}
              />
              <InfoCard
                icon={Truck}
                title="Transport Details"
                fields={[
                  {
                    label: "Status",
                    value: currentEnrollment.transportStatus || "N/A",
                  },
                  {
                    label: "Route Name",
                    value:
                      transportDetails?.transportAssignment?.route?.routeName ||
                      "N/A",
                  },
                  {
                    label: "Stop Name",
                    value:
                      transportDetails?.transportAssignment?.stop?.stopName ||
                      "N/A",
                  },
                ]}
              />
              <InfoCard
                icon={Home}
                title="Hostel Details"
                fields={[
                  {
                    label: "Status",
                    value: currentEnrollment.hostelStatus || "N/A",
                  },
                  {
                    label: "Hostel Name",
                    value:
                      hostelDetails?.hostelAssignment?.hostel.hostelName ||
                      "N/A",
                  },
                  {
                    label: "Floor Number",
                    value:
                      hostelDetails?.hostelAssignment?.room.floorNumber ||
                      "N/A",
                  },
                  {
                    label: "Room Number",
                    value:
                      hostelDetails?.hostelAssignment?.room.roomNumber || "N/A",
                  },
                ]}
              />
              <InfoCard
                icon={Home}
                title="Contact Information"
                fields={[
                  {
                    label: "Communication No",
                    value: student.communicationNo || "N/A",
                  },
                  { label: "Phone No", value: student.phoneNo || "N/A" },
                  { label: "Email Address", value: student.email || "N/A" },
                ]}
              />
            </div>
          </motion.div>

          {/* Details Sections */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
            <InfoSection
              icon={User}
              title="Personal Information"
              fields={[
                { label: "Name", value: student.firstName },
                { label: "Last Name", value: student.lastName || "N/A" },
                { label: "Gender", value: student.gender },
                {
                  label: "Date of Birth",
                  value: new Date(student.dateOfBirth).toLocaleDateString(),
                },
                { label: "Blood Group", value: student.bloodGroup || "N/A" },
                {
                  label: "Mother Tongue",
                  value: student.motherTongue || "N/A",
                },
                { label: "Religion", value: student.religion || "N/A" },
                { label: "Aadhar No", value: student.aadharNo || "N/A" },
                { label: "Emis No", value: student.emisNo || "N/A" },
                { label: "Community", value: student.community || "N/A" },
                { label: "Caste", value: student.caste || "N/A" },
              ]}
            />

            <InfoSection
              icon={MapPin}
              title="Location Information"
              fields={[
                {
                  label: "Place Of Birth",
                  value: student.placeOfBirth || "N/A",
                },
                { label: "Country", value: student.country },
                { label: "State", value: student.state },
                { label: "City", value: student.cityTownVillage },
                { label: "Address", value: student.address },
              ]}
            />

            <InfoSection
              icon={Users}
              title="Family Details"
              fields={[
                { label: "Guardian 1 Name", value: student.relationName1 },
                { label: "Relation Type", value: student.relationType1 },
                { label: "Contact Number", value: student.relationNo1 },
                {
                  label: "Guardian 2 Name",
                  value: student.relationName2 || "N/A",
                },
                {
                  label: "Relation Type",
                  value: student.relationType2 || "N/A",
                },
                {
                  label: "Contact Number",
                  value: student.relationNo2 || "N/A",
                },
              ]}
            />

            <InfoSection
              icon={GraduationCap}
              title="Academic Information"
              fields={[
                {
                  label: "Academic Year",
                  value: currentEnrollment.academicYear,
                },
                { label: "Class", value: currentEnrollment.class },
                { label: "Section", value: currentEnrollment.section },
                { label: "Branch", value: currentEnrollment.branchName },
                { label: "Admission No", value: student.admissionNo || "N/A" },
                {
                  label: "Application No",
                  value: student.applicationNo || "N/A",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  fields,
}: {
  icon: ElementType;
  title: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-2 rounded-lg">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-red-600">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="p-3 rounded-lg transition-colors duration-200"
            >
              <label className="text-sm font-medium text-gray-900">
                {field.label}
              </label>
              <p className="text-base font-medium text-gray-500">
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  fields,
}: {
  icon: ElementType;
  title: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-2 rounded-lg">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">{title}</h2>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={index}
              className="rounded-lg transition-colors duration-200"
            >
              <label className="text-sm font-medium text-gray-900">
                {field.label}
              </label>
              <p className="text-base font-medium text-gray-500">
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
