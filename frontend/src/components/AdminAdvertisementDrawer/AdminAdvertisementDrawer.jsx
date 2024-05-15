import React from 'react';
import './AdminAdvertisementDrawer.css';
import { Button, Drawer } from 'antd';

const AdminAdvertisementDrawer = ({ open, setOpen, advertisementData }) => {
    const onClose = () => {
        setOpen(false);
    };

    const handleDeleteadvertisement = () => {
        console.log('Deleting advertisement');
    };

    const handleEditadvertisement = () => {
        console.log('Editing advertisement');
    };

    const handleApproveadvertisement = () => {
        console.log('Approving advertisement');
    };

    return (
        <>
            <Drawer title="Panel administratora" onClose={onClose} open={open}>
                <div>
                    <p>Nazwa oferty: {advertisementData && advertisementData.name}</p>
                    <p>Opis oferty: {advertisementData && advertisementData.description}</p>
                </div>
                <div>
                    <Button onClick={handleDeleteadvertisement}>
                        Usuń ofertę
                    </Button>
                </div>
                <div>
                    <Button onClick={handleEditadvertisement}>
                        Edytuj ofertę
                    </Button>
                </div>
                <div>
                    <Button onClick={handleApproveadvertisement}>
                        Zatwierdź ofertę
                    </Button>
                </div>
                <div>
                    <Button onClick={onClose}>
                        Zamknij
                    </Button>
                </div>
            </Drawer>
        </>
    );
};

export default AdminAdvertisementDrawer;
