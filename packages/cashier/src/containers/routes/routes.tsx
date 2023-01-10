import React from 'react';
import { withRouter } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { useTheme } from '@deriv/ui';
import BinaryRoutes from './binary-routes';
import ErrorComponent from './error-component';

const Routes = observer(() => {
    const { client, common, ui } = useStore();
    const { is_logged_in, is_logging_in } = client;
    const { error, has_error } = common;
    const { is_dark_mode_on } = ui;

    const { setColorMode } = useTheme();

    React.useEffect(() => {
        setColorMode(is_dark_mode_on ? 'dark' : 'light');
    }, [is_dark_mode_on]);

    if (has_error) {
        return <ErrorComponent {...error} />;
    }

    return <BinaryRoutes is_logged_in={is_logged_in} is_logging_in={is_logging_in} />;
});

export default withRouter(Routes);
