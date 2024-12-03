function logout() {
    fetch('/logout', {
        method: 'POST'
    }).then(response => {
        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Failed to log out');
        }
    }).catch(error => {
        console.error('Failed to log out:', error);
    });
}