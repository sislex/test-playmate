import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

import { DialogCrossButton } from "components/DialogCrossButton";
import { ListBoxArray } from "./ListBoxArray";
import InputComponent from "./InputComponent";

import {ethers, JsonRpcProvider} from "ethers";
import BarLoader from 'react-spinners/BarLoader';


interface WalletDialogContentProps {
    onClose: () => void;
}

export interface INetwork { id: string; name: string; tokenName: string; }
export interface IWallet { id: string; name: string;  }



export function WalletDialogContent({ onClose }: WalletDialogContentProps) {
    const [activeTab, setActiveTab] = useState("balance");


    const [selectedSender, setSelectedSender] = useState<IWallet | null>(null);
    const [selectedRecipient, setSelectedRecipient] = useState<IWallet | null>(null);
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState<string>("");
    const [activeBalance, setActiveBalance] = useState(false);
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const [isTransactionLoading, setIsTransactionLoading] = useState(false);

    const [selectedNetwork, setSelectedNetwork] = useState<INetwork | null>(null);
    const [networkList, setNetworkList] = useState<INetwork[]>([
        {
            name: "Sepolia Testnet",
            id: "https://sepolia.infura.io/v3/6113828fd8e8448f9a9e3fa7962e2cc6",
            tokenName: "SepoliaETH"
        },
        {
            name: "Goerli Testnet",
            id: "https://goerli.infura.io/v3/your-infura-key",
            tokenName: "GoerliETH"
        },
    ]);

    const [selectedWallet, setSelectedWallet] = useState< IWallet | null>(null);
    const [walletList, setWalletList] = useState<IWallet[]>([
        {
            name: "0x2Bc3E1bb6C3C68720b392733993Bfef7334d3cbe",
            id: "32f561a84be0480b20b69c8633b9ef48464e5bb863627209c502897e823427d3"
        },
        {
            name: "0x4cCE85dA450fC8D96B87671683B07297F13C13ff",
            id: "37cadf72c4f33fb624f5872c9262a70fc0f6a1b1d31f3cedb7cc20201508251d"
        },
        {
            name: "0xc8dBEDEd3f0f3fDA4DDa3fAF353C305Ad44cCbCA",
            id: "fde292ba78cb9dde009d7eab8a262b7e0d61b39f839c6e597444fa332be79251"
        },
    ]);




    const sendTransaction = async () => {
        if (!selectedSender || !selectedRecipient || !selectedNetwork || !amount) {
            alert("fill in all fields");
            return;
        }

        try {
            setIsTransactionLoading(true);
            const provider = new JsonRpcProvider(selectedNetwork.id);
            const wallet = new ethers.Wallet(selectedSender.id, provider);

            const tx = await wallet.sendTransaction({
                to: selectedRecipient.name,
                value: ethers.parseEther(amount),
            });

            await tx.wait(); // wait load transaction
            setIsTransactionLoading(false);
        } catch {

        }
    };


    const getBalanceByWalletId = async (walletId: string) => {
        setIsBalanceLoading(true);
        if (selectedNetwork) {
            const wallet = walletList.find(w => w.id === walletId);
            if (!wallet) {
                console.error("Кошелек не найден");
                return null;
            }

            return await getBalance(wallet.name, selectedNetwork.id);
        } else {
            return null;
        }
    };

    const getBalance = async (selectedWalletName: string, selectedNetworkId: string) => {

        try {
            const provider = new JsonRpcProvider(selectedNetworkId);
            const balanceWei = await provider.getBalance(selectedWalletName);
            const balanceEth: string = ethers.formatEther(balanceWei);
            if (balanceEth) {
                setBalance(parseFloat(balanceEth).toFixed(4));
                setActiveBalance(true);
                return balanceEth;
            }
        } catch (error) {
            console.error("Ошибка при получении баланса:", error);
            return null;
        }finally {
            setIsBalanceLoading(false); // Выключаем лоадер в любом случае
        }
    };



    return (
        <>
            <div className="min-h-[530px] min-w-[500px] relative  transition-all">

                <Dialog.Title as="header" className="relative">
                    <h2 className="text-center text-2xl font-bold desk-dialog:mx-16">
                        Wallets
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
                                <ListBoxArray
                                    label="Network"
                                    placeholder="Select Network"
                                    initValue={selectedNetwork}
                                    onChangeValue={(value) => {
                                        setSelectedNetwork(value);
                                        setBalance("");
                                    }}
                                    data={networkList}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-5">
                            <div className="min-w-[12rem] flex-1">
                                <ListBoxArray
                                    label="Wallet"
                                    placeholder="Select Wallet"
                                    initValue={selectedWallet}
                                    onChangeValue={(value) => {
                                        setSelectedWallet(value);
                                        setBalance("");
                                    }}
                                    data={walletList}
                                />
                            </div>
                        </div>
                        {isBalanceLoading ? (
                            <BarLoader color="#5ce5e2"
                                       cssOverride={{
                                           display: "block",
                                           margin: "5vh auto",
                                           borderColor: "red",
                                       }}
                                       size={10}
                            />
                        ) : balance !== "" ? (
                            <div
                                className="mt-5 rounded-2.5xl border border-grey-high px-6 py-3 text-center text-lg desk-dialog:mx-32">
                                Balance: {" "}
                                <span className="font-bold text-blue-high">{balance} </span>
                                {selectedNetwork?.tokenName}
                            </div>
                        ) : null}

                        {/* Footer */}
                        <footer className="mt-20 flex justify-center gap-x-7 absolute bottom-5 w-full left-0">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-half bg-grey-high px-16 py-3 text-dim-white hover:bg-blue-high/10 sm:flex-initial"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!selectedWallet) return alert("Select a wallet");
                                    if (!selectedNetwork) return alert("Select a network");

                                    await getBalanceByWalletId(selectedWallet.id);
                                }}
                                className="flex-1 rounded-half bg-blue-high px-16 py-3 text-dim-black hover:bg-blue-high/80 sm:flex-initial"
                            >
                                Check balance
                            </button>

                        </footer>
                    </>
                )}

                {activeTab === "transaction" && (
                    <>
                        <div className="min-w-[12rem] flex-1">
                            <ListBoxArray
                                label="Network"
                                placeholder="Select Network"
                                initValue={selectedNetwork}
                                onChangeValue={(value) => {
                                    setSelectedNetwork(value);
                                }}
                                data={networkList}
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-5">
                            <div className="min-w-[12rem] flex-1">
                                <ListBoxArray
                                    label="Sender"
                                    placeholder="Select sender"
                                    initValue={selectedSender}
                                    onChangeValue={setSelectedSender}
                                    data={walletList}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-5">
                            <div className="min-w-[12rem] flex-1">
                                <ListBoxArray
                                    label="Recipient"
                                    placeholder="Select recipient"
                                    initValue={selectedRecipient}
                                    onChangeValue={setSelectedRecipient}
                                    data={walletList}
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

                        {isTransactionLoading ? (
                            <BarLoader color="#5ce5e2"
                                       cssOverride={{
                                           display: "block",
                                           margin: "-8px auto",
                                           borderColor: "red",
                                       }}
                                       size={10}
                            />
                        ) : null}

                        <footer className="mt-20 flex justify-center gap-x-7 absolute bottom-5 w-full left-0">
                            <button
                                onClick={onClose}
                                className="flex-1 rounded-half bg-grey-high px-16 py-3 text-dim-white hover:bg-blue-high/10 sm:flex-initial"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={sendTransaction}
                                className="flex-1 rounded-half bg-blue-high px-16 py-3 text-dim-black hover:bg-blue-high/80 sm:flex-initial">
                                Send
                            </button>
                        </footer>
                    </>
                )}
            </div>
        </>
    );
}
