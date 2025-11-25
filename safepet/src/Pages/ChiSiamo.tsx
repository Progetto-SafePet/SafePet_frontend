import Banner from "../components/Banner/Banner";
import Title from "../components/Title/Title";
import TeamMember from "../components/TeamMember/TeamMember"


function ChiSiamo() {
    const teamMembers = [
        {
            name: "Francesco",
            surname: "Torino",
            github: "https://github.com/FrancescoTorino1999",
            image: "https://avatars.githubusercontent.com/u/80252595?v=4"
        },
        {
            name: "Luca",
            surname: "Salvatore",
            github: "https://github.com/lucasalvaa",
            image: "https://avatars.githubusercontent.com/u/85059430?v=4"
        },
        {
            name: "Matteo",
            surname: "Emolo",
            github: "https://github.com/0xMatte",
            image: "https://avatars.githubusercontent.com/u/103219799?v=4"
        },
        {
            name: "Francesco",
            surname: "Pinto",
            github: "https://github.com/FrancescoPinto02",
            image: "https://avatars.githubusercontent.com/u/128143467?v=4"
        },
        {
            name: "Rosario",
            surname: "Saggese",
            github: "https://github.com/rossssss111",
            image: "https://avatars.githubusercontent.com/u/169466957?v=4"
        },
        {
            name: "Vincenzo",
            surname: "Nappi",
            github: "https://github.com/VincenzoGN",
            image: "https://avatars.githubusercontent.com/u/169762312?v=4"
        },
        {
            name: "Morgan",
            surname: "Vitiello",
            github: "https://github.com/MorganVitiello",
            image: "https://avatars.githubusercontent.com/u/185283298?v=4"
        },
        {
            name: "Simone",
            surname: "Cimmino",
            github: "https://github.com/SimoCimmi",
            image: "https://avatars.githubusercontent.com/u/189377061?v=4"
        },
        {
            name: "Chiara",
            surname: "Memoli",
            github: "https://github.com/chiara0605",
            image: "https://avatars.githubusercontent.com/u/190141224?v=4"
        },
        {
            name: "Aldo",
            surname: "Adinolfi",
            github: "https://github.com/aldoadi04",
            image: "https://avatars.githubusercontent.com/u/206192026?v=4"
        },
        {
            name: "Anna Chiara",
            surname: "Memoli",
            github: "https://github.com/memoli04",
            image: "https://avatars.githubusercontent.com/u/190292037?v=4"
        },
        {
            name: "Giuseppe",
            surname: "Rossano",
            github: "https://github.com/PeppeRed04",
            image: "https://avatars.githubusercontent.com/u/238479021?v=4"
        },
        {
            name: "Gianmarco",
            surname: "Amatruda",
            github: "gianamrco: https://github.com/Giammi19",
            image: "https://avatars.githubusercontent.com/u/238502418?v=4"
        }
    ];

    return (
        <>
            <div className="page-container">
                <div className="page">
                    <div className='main-container'>
                        <Title text="Chi Siamo" />
                        <Banner
                            text="Un team di professionisti dedicato alla salute e al benessere dei tuoi animali domestici"
                            buttonText="Scopri SafePet"
                            link="/"
                        />

                        <div className="team-section">
                            <div className="team-intro">
                                <h2>Il Nostro Team</h2>
                                <p>
                                    Siamo un team che crede che ogni animale meriti protezione, cura e una voce anche
                                    nei momenti più difficili. Con SafePet trasformiamo la tecnologia in un gesto
                                    d'amore, rendendo le informazioni sanitarie sempre accessibili e sicure. Lavoriamo
                                    ogni giorno per un futuro in cui nessun animale sia mai lasciato solo nelle
                                    emergenze.
                                </p>
                            </div>

                            <div className="team-grid">
                                {teamMembers.map((member, index) => (
                                    <TeamMember
                                        key={index}
                                        name={member.name}
                                        surname={member.surname}
                                        github={member.github}
                                        image={member.image}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mission-section">
                            <h2>La Nostra Missione</h2>
                            <div className="mission-content">
                                <div className="mission-card">
                                    <div className="mission-icon">🎯</div>
                                    <h3>Innovazione</h3>
                                    <p>Sviluppiamo soluzioni tecnologiche all'avanguardia per semplificare la gestione della salute animale</p>
                                </div>
                                <div className="mission-card">
                                    <div className="mission-icon">🤝</div>
                                    <h3>Collaborazione</h3>
                                    <p>Creiamo ponti tra veterinari, strutture e proprietari per una cura integrata e coordinata</p>
                                </div>
                                <div className="mission-card">
                                    <div className="mission-icon">❤️</div>
                                    <h3>Passione</h3>
                                    <p>Il benessere degli animali è al centro di ogni nostra decisione e innovazione</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChiSiamo;