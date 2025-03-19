export default function Authenticate() {
    return (
        <div className="container-pro">
            <div className="profile-card">
                <div className="header">
                    <div className="user-info">
                        <img src="https://scontent.fhan18-1.fna.fbcdn.net/v/t39.30808-1/273580518_731183044956054_1644799682958879990_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=eimMh16sskIQ7kNvgFmhtVw&_nc_oc=Adj38qdOGrn7tuMEn0ECl223FkAMPt78SGCZxTbgNdfaRXAF0wIV2_jdwfoV-bcr_6Y&_nc_zt=24&_nc_ht=scontent.fhan18-1.fna&_nc_gid=Aqp0iQzywhDa80slvLLD8IH&oh=00_AYBrTpZXc-Dk8eil-fPyvq_a22CaGgx0s7th24NSxm26aw&oe=67B08CA1" className="avatar" alt="Profile" />
                        <div>
                            <h2 className="username"></h2>
                            <p className="email">ngoc@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="form-container">
                    {/* <div className="form-group">
                        <label>Name</label>
                        <div className="name-fields">
                            <input type="text" defaultValue="" />
                            <input type="text" defaultValue="" />
                        </div>
                    </div> */}

                    <div className="form-group">
                        <label>Email address</label>
                        <div className="input-wrapper">
                            <span className="icon"><i className="fa-regular fa-envelope"></i></span>
                            <input type="email" placeholder="email" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-wrapper">
                            <span className="icon"><i className="fa-regular fa-user"></i></span>
                            <input type="text" placeholder="username" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Profile photo</label>
                        <div className="profile-photo">
                            <input type="file" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <span className="icon"><i className="fa-solid fa-key"></i></span>
                            <input type="password" placeholder="password" />
                        </div>
                    </div>
                </div>

                <div className="actions">
                    <button className="delete-btnn"> <i className="fa-solid fa-trash"></i> Delete user</button>
                    <div className="action-buttons">
                        <button className="cancel-btn"><i className="fa-solid fa-xmark"></i> Cancel</button>
                        <button className="save-btn"><i className="fa-solid fa-floppy-disk"></i> Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
