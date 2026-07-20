import * as bootstrap from 'bootstrap';

/**
 * * Hide all visible Bootstrap modals and remove their backdrops
 * * Direct access to document is required because Bootstrap renders some elements outside Angular's component boundaries
 */
export const removeBootstrapModals = () => {
	Array.from(document.getElementsByClassName('.modal')).forEach((element) => {
		const modalToHide = new bootstrap.Modal(element);

		modalToHide.hide();
	});
	Array.from(document.querySelectorAll('.modal-backdrop')).forEach((element) => element.remove());
};
