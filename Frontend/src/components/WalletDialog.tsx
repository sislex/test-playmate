import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

import { DialogCrossButton } from "components/DialogCrossButton";
import { ListBox } from "./ListBox";
import { ListBoxArray } from "./ListBoxArray";
import InputComponent from "./InputComponent";

interface WalletDialogContentProps {
    onClose: () => void;
}

export function WalletDialogContent({ onClose }: WalletDialogContentProps) {
    const [activeTab, setActiveTab] = useState("balance");
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [amount, setAmount] = useState("");

    const [walletList, setWalletList] = useState([
        { name: "add1", id: "name__1" },
        { name: "add2", id: "name__2" },
    ]);


    return (
        <>
            <div className="min-h-[450px] min-w-[500px] relative  transition-all">

            <Dialog.Title as="header" className="relative">
                <h2 className="text-center text-2xl font-bold desk-dialog:mx-16">
                    Wallet connect
                </h2>
                <DialogCrossButton onClick={onClose} />
            </Dialog.Title>

            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => setActiveTab("balance")}
                    data-app-active={activeTab === "balance"}
                    className="px-4 py-2 font-medium text-base rounded-full border hover:bg-blue-high/10 data-[app-active=true]:bg-blue-high/10"
                >
                    Balance
                </button>
                <button
                    onClick={() => setActiveTab("connect")}
                    data-app-active={activeTab === "connect"}
                    className="px-4 py-2 font-medium text-base rounded-full border hover:bg-blue-high/10 data-[app-active=true]:bg-blue-high/10"
                >
                    Connect
                </button>
                <button
                    onClick={() => setActiveTab("transaction")}
                    data-app-active={activeTab === "transaction"}
                    className="px-4 py-2 font-medium text-base rounded-full border hover:bg-blue-high/10 data-[app-active=true]:bg-blue-high/10"
                >
                    Transaction
                </button>
            </div>

            {activeTab === "balance" && (
                <>
                    {/* Select Row */}
                    <div className="mt-6 flex flex-wrap gap-5">
                        <div className="min-w-[12rem] flex-1">
                            <ListBox
                                label="Network"
                                placeholder="Select Network"
                                selected={selectedNetwork}
                                onChangeValue={setSelectedNetwork}
                                data={["MetaMask", "Trust Wallet", "Coinbase Wallet"]}
                            />
                        </div>
                        <div className="min-w-[12rem] flex-1">
                            <ListBoxArray
                                label="Wallet"
                                placeholder="Select Wallet"
                                selected={selectedWallet}
                                onChangeValue={setSelectedWallet}
                                data={walletList}
                                getLabel={(item) => item.name}
                            />
                        </div>
                    </div>

                    {/* Amount Due */}
                    <div className="mt-5 rounded-2.5xl border border-grey-high px-6 py-3 text-center text-lg desk-dialog:mx-32">
                        You owe a total of{" "}
                        <span className="font-bold text-blue-high">$85</span>
                    </div>

                    {/* Footer */}
                    <footer className="mt-20 flex justify-center gap-x-7 absolute bottom-5 w-full left-0">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-half bg-grey-high px-16 py-3 text-dim-white hover:bg-blue-high/10 sm:flex-initial"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 rounded-half bg-blue-high px-16 py-3 text-dim-black hover:bg-blue-high/80 sm:flex-initial">
                            Check balance
                        </button>
                    </footer>
                </>
            )}

            {activeTab === "connect" && (
                <>
                    <div className="mt-5 flex flex-wrap gap-5">
                        <InputComponent
                            label="Address"
                            onChange={setAddress}
                            placeholder="Enter Address"
                            type="text"
                            style="min-w-full"
                        />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-5">
                        <InputComponent
                            label="Private key"
                            onChange={setPrivateKey}
                            placeholder="Enter Private Key"
                            type="text"
                            style="min-w-full"
                        />
                    </div>

                    <footer className="mt-20 flex justify-center gap-x-7 absolute bottom-5 w-full left-0">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-half bg-grey-high px-16 py-3 text-dim-white hover:bg-blue-high/10 sm:flex-initial"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (!address || !privateKey) return; // простая валидация

                                const exists = walletList.some(
                                    (item) => item.name === address || item.id === privateKey
                                );

                                if (!exists) {
                                    setWalletList((prev) => [...prev, { name: address, id: privateKey }]);
                                }

                                setAddress("");
                                setPrivateKey("");
                            }}

                            className="flex-1 rounded-half bg-blue-high px-16 py-3 text-dim-black hover:bg-blue-high/80 sm:flex-initial"
                        >
                            Connect Wallet
                        </button>

                    </footer>
                </>
            )}

            {activeTab === "transaction" && (
                <>
                    <div className="mt-6 flex flex-wrap gap-5">
                        <div className="min-w-[12rem] flex-1">
                            <ListBoxArray
                                label="Sender"
                                placeholder="Select sender"
                                selected={selectedSender}
                                onChangeValue={setSelectedSender}
                                data={walletList}
                                getLabel={(item) => item.name}
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-5">

                        <div className="min-w-[12rem] flex-1">
                            <ListBoxArray
                                label="Recipient"
                                placeholder="Select recipient"
                                selected={selectedRecipient}
                                onChangeValue={setSelectedRecipient}
                                data={walletList}
                                getLabel={(item) => item.name}
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-5">
                        <InputComponent
                            label="Amount"
                            onChange={setAmount}
                            placeholder="Enter amount"
                            type="number"
                            style="min-w-full"
                        />
                    </div>

                    <footer className="mt-20 flex justify-center gap-x-7 absolute bottom-5 w-full left-0">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-half bg-grey-high px-16 py-3 text-dim-white hover:bg-blue-high/10 sm:flex-initial"
                        >
                            Cancel
                        </button>
                        <button className="flex-1 rounded-half bg-blue-high px-16 py-3 text-dim-black hover:bg-blue-high/80 sm:flex-initial">
                            Send
                        </button>
                    </footer>
                </>
            )}
                </div>
        </>
    );
}
