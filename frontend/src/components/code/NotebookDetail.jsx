import React from 'react'



const { notebookId } = useParams();
const [notebook, setNotebook] = useState(null);
const [sections, setSections] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [isTocVisible, setTocVisible] = useState(false);

useEffect(() => {
    const fetchNotebookDetail = async () => {
        try {
            const docRef = doc(db, 'notebooks', notebookId);
            const notebookDoc = await getDoc(docRef);
            if (notebookDoc.exists()) {
                const notebookData = notebookDoc.data();
                setCourse(notebookData);
                setSections(Array.isArray(notebookData.sections) ? notebookData.sections : []);
            } else {
                setError('Course not found.');
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            setError('Error fetching course data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    fetchNotebookDetail();
}, [notebookId]);

if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <ThreeDots color="#003656" height={80} width={80} />
        </div>
    );
}

if (error) {
    return (
        <div className="text-center text-red-500">
            <p>{error}</p>
        </div>
    );
}

const NotebookDetail = () => {
    return (
        <div>
            <MainHero title={notebook.title}
                description={notebook.description}
                image={notebook.icon} />
        </div>
    )
}

export default NotebookDetail