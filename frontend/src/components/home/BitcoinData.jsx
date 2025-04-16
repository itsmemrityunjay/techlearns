"use client"

import { useState, useEffect } from "react"
import { getDocs, collection } from "firebase/firestore"
import { db } from "../../database/Firebase"
import { useNavigate } from "react-router-dom"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PeopleIcon from "@mui/icons-material/People"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import StarIcon from "@mui/icons-material/Star"

const CompetitionList = () => {
  const [competitions, setCompetitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "competitions"))
        const fetchedCompetitions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        const latestCompetitions = fetchedCompetitions.slice(-4)
        setCompetitions(latestCompetitions)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching competitions: ", error)
        setIsLoading(false)
      }
    }
    fetchCompetitions()
  }, [])

  const isCompetitionLive = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    return now >= start && now <= end
  }

  const truncateText = (text, wordLimit) => {
    if (!text) return ""
    const words = text.split(" ")
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-[#ffaa00] from-green-400 to-green-600 text-white"
      case "upcoming":
        return "bg-[#ffaa00] from-blue-400 to-blue-600 text-white"
      case "ended":
        return "bg-[#ffaa00] from-gray-400 to-gray-600 text-white"
      default:
        return "bg-[#ffaa00] from-purple-400 to-purple-600 text-white"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-12  px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center text-customBlue uppercase relative">
            <span className="relative z-10">Competitions</span>
            <span className="absolute bottom-0 left-0 w-1/2 h-2"></span>
            <EmojiEventsIcon className="ml-4 text-customBlue" fontSize="large" />
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl font-light">
            "Showcase your talent with exciting competition challenges. Compete, learn, and win amazing prizes!"
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex justify-center mb-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg -mt-8"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded-lg mb-2 w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded-full mb-4 w-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="h-6 bg-gray-200 rounded-lg mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {competitions.map((competition) => (
            <div
              key={competition.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/competition/${competition.id}`)}
            >
              {/* Card Header with Competition Image Background */}
              <div className="h-64 relative overflow-hidden">
                {/* Background Image with Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${competition.image || competition.icon || "/placeholder.svg?height=600&width=200"})`,
                  }}
                >
                  {/* Gradient Overlay for better text visibility */}
                 
                </div>

                {/* Competition Icon */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                
                </div>

                {/* Featured Badge */}
                {competition.featured && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 p-1 rounded-full shadow-md">
                    <StarIcon fontSize="small" />
                  </div>
                )}

                {/* Status Badge */}
                {competition.status && (
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getStatusColor(
                      competition.status,
                    )}`}
                  >
                    {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 pt-2 h-[250px] flex flex-col mx-auto justify-between">
                {/* Title */}
                <h3 className="text-lg font-bold text-left text-gray-800 mb-1">{truncateText(competition.title,4)}</h3>

                {/* Subtitle */}
                <p className="text-gray-600 text-xs text-left mb-4 font-light">
                  {truncateText(competition.subtitle, 10)}
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-customBlue/30 to-transparent mb-4"></div>

                {/* Competition Details - More Compact */}
                <div className="flex items-center justify-between space-x-4 mb-3 ">
  {/* Start Date */}
  <div className="flex items-start">
    <div className="w-8 h-8 rounded-full mr-2 bg-blue-100 flex items-center justify-center mb-1 text-blue-500">
      <CalendarTodayIcon style={{ fontSize: "14px" }} />
    </div>
    <div>
    <span className="text-xs text-gray-500">Start</span>
    <p className="text-xs font-medium text-gray-700">{formatDate(competition.startDate)}</p>
    </div>
  </div>

  {/* End Date */}
  <div className="flex items-start">
    <div className="w-8 h-8 rounded-full bg-red-100 mr-2 flex items-center justify-center mb-1 text-red-500">
      <CalendarTodayIcon style={{ fontSize: "16px" }} />
    </div>
    <div>
    <span className="text-xs text-gray-500">End</span>
    <p className="text-xs font-medium text-gray-700">{formatDate(competition.endDate)}</p>
    </div>
  </div>

  {/* Participants */}
  
</div>

                {/* Prize Pool - More Compact */}
                {/* <div className="flex items-start">
    <div className="w-8 h-8 rounded-full bg-green-100 mr-2 flex items-center justify-center mb-1 text-green-500">
      <PeopleIcon style={{ fontSize: "16px" }} />
    </div>
    <div>
    <span className="text-xs text-gray-500">Users</span>
    <p className="text-xs font-medium text-gray-700">{competition.participants || 0}</p>
    </div>
  </div> */}
                <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <EmojiEventsIcon className="text-yellow-500 mr-1" style={{ fontSize: "16px" }} />
                      <span className="text-xs font-medium text-gray-700">Prize Pool:</span>
                    </div>
                    <span className="font-bold text-sm text-customBlue">{competition.prizePool || "TBD"}</span>
                  </div>
                </div>

                {/* View Details Button - More Compact */}
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center justify-center text-xs text-customBlue font-medium py-1.5 px-3 rounded-full bg-customBlue/5 group-hover:bg-customBlue group-hover:text-white transition-all duration-300 w-full">
                    View Details
                    <ArrowForwardIcon
                      className="ml-1 transition-transform group-hover:translate-x-1"
                      style={{ fontSize: "14px" }}
                    />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CompetitionList