import styles from "@/styles/Home.module.scss";

const Card = ({item}) => {


    return (
        <div className="card-container">
            <div className="card">
                <div className="top-card-container">
                    <div className="left-top-card-container">
                        <div className="item-name-container">
                            <a
                                href="/fr/encyclopedie/objet/120/8222"
                                className="item-name"
                            >
                                {item.title.fr}
                            </a>
                        </div>
                        <div className="item-type-level-container">
                            <a
                                href="/fr/encyclopedie/objet/120/8222"
                                className="item-type-level"
                            >
                                Amulette - {item.definition.item.level}
                            </a>
                        </div>
                    </div>
                    <div className="right-top-card-container">
                        <div className="image-square"></div>
                    </div>
                </div>
                <div className="middle-card-container">
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">{item.id}</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">1 Portée</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">220 PV</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">17 Tacle</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">17 Esquive</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">
                            71 Maîtrise sur 3 éléments aléatoires
                        </span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">24 Maîtrise Distance</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">4% Coup critique</span>
                    </div>
                    <div className="item-stat-container">
                        <div className="temp-stat-image"></div>
                        <span className="item-stat">
                            20 Résistance Élémentaire
                        </span>
                    </div>
                </div>
                <div className="bottom-card-container">
                    <div className="left-bottom-card-container"></div>
                    <div className="right-bottom-card-container"></div>
                </div>
            </div>
        </div>
    );
};

export default Card;
