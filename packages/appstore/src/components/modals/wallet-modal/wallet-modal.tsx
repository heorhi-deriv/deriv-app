import React from 'react';
import { Modal, DesktopWrapper, MobileWrapper, MobileDialog } from '@deriv/components';
import WalletModalHeader from './wallet-modal-header';
import WalletModalBody from './wallet-modal-body';
import { observer, useStore } from '@deriv/stores';
import classNames from 'classnames';

const WalletModal = observer(() => {
    const store = useStore();
    const {
        client: { balance, currency, landing_company_shortcode: shortcode },
        ui: { is_dark_mode_on, is_wallet_modal_visible, is_mobile, setIsWalletModalVisible },
        traders_hub: { is_demo },
    } = store;

    // TODO: Temporary wallet type. Will be refactored later. Add correct type
    const wallet_type = is_demo ? 'demo' : 'real';

    const tab_content_ref = React.useRef<HTMLDivElement>(null);
    const [active_tab_index, setActiveTabIndex] = React.useState<number>(0);
    const [is_wallet_name_visible, setIsWalletNameVisible] = React.useState<boolean>(true);

    const closeModal = () => {
        setIsWalletModalVisible(false);
        setActiveTabIndex(0);
    };

    React.useEffect(() => {
        const el_tab_content = tab_content_ref.current;

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            setIsWalletNameVisible(!(target.scrollTop > 0));
        };

        if (is_mobile) {
            el_tab_content?.addEventListener('scroll', handleScroll);
            setIsWalletNameVisible(true);
        }

        return () => {
            el_tab_content?.removeEventListener('scroll', handleScroll);
        };
    }, [active_tab_index, is_wallet_modal_visible, is_mobile]);

    const content = (
        <>
            <WalletModalHeader
                balance={balance}
                closeModal={closeModal}
                currency={currency}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_mobile={is_mobile}
                shortcode={shortcode}
                is_wallet_name_visible={is_wallet_name_visible}
            />
            <WalletModalBody
                active_tab_index={active_tab_index}
                is_dark={is_dark_mode_on}
                is_demo={is_demo}
                is_wallet_name_visible={is_wallet_name_visible}
                setActiveTabIndex={setActiveTabIndex}
                wallet_type={wallet_type}
            />
        </>
    );

    return (
        <>
            <DesktopWrapper>
                <Modal is_open={is_wallet_modal_visible} className='wallet-modal' portalId='app_contents'>
                    {content}
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    className='mobile-wallet'
                    wrapper_classname={classNames('mobile-wallet__wrapper', {
                        'content-scrolled': !is_wallet_name_visible,
                    })}
                    portal_element_id='deriv_app'
                    visible={is_wallet_modal_visible}
                    has_content_scroll={false}
                    ref={tab_content_ref}
                >
                    {content}
                </MobileDialog>
            </MobileWrapper>
        </>
    );
});

export default WalletModal;
