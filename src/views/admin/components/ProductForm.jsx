import React, { useState } from 'react';
import CircularProgress from 'components/ui/CircularProgress';
import ImageLoader from 'components/ui/ImageLoader';
import Input from 'components/ui/Input';

import useFileHandler from 'hooks/useFileHandler';
import PropTypes from 'prop-types';
// import uuid from 'uuid';

const ProductForm = ({ product, onSubmit, isLoading }) => {
	const [field, setField] = useState({
		name: { value: product ? product.name : '' },
		brand: { value: product ? product.brand : '' },
		price: { value: product ? product.price : 0 },
		maxQuantity: { value: product ? product.maxQuantity : 0 },
		description: { value: product ? product.description : '' },
		keywords: { value: product ? product.keywords : ['gago'] },
		imageUrl: { value: product ? product.image : '' }
	});

	const {
		imageFile,
		isFileLoading,
		onFileChange
	} = useFileHandler({ image: {} });

	const sanitizeNumber = (num) => {
		return Number(num.toString().replace(/^0*/, ''));
	};

	const onProductNameInput = (e, value, error) => {
		setField({ ...field, name: { value, error } });
	};

	const onProductBrandInput = (e, value, error) => {
		setField({ ...field, brand: { value, error } });
	};

	const onProductPriceInput = (e, value, error) => {
		setField({ ...field, price: { value: sanitizeNumber(value), error } });
	};

	const onProductDescriptionInput = (e, value, error) => {
		setField({ ...field, description: { value, error } });
	};

	const onProductMaxQuantityInput = (e, value, error) => {
		setField({ ...field, maxQuantity: { value: sanitizeNumber(value), error } });
	};

	const onSubmitForm = (e) => {
		e.preventDefault();
		// eslint-disable-next-line no-extra-boolean-cast
		const noError = Object.keys(field).every(key => !!!field[key].error);

		if (field.name.value
			&& field.price.value
			&& field.maxQuantity.value
			&& (imageFile.image.file || field.imageUrl.value)
			&& noError
		) {
			const newProduct = {};

			Object.keys(field).forEach((i) => {
				newProduct[i] = field[i].value;
			});

			onSubmit({
				...newProduct,
				quantity: 1,
				dateAdded: new Date().getTime(),
				image: imageFile.image.file ? imageFile.image.file : field.imageUrl.value
			});
		}
	};

	return (
		<div>
			<form
				className="product-form"
				onSubmit={onSubmitForm}
			>
				<div className="product-form-inputs">
					<div className="d-flex">
						<div className="product-form-field">
							<Input
								field="name"
								isRequired
								label="* Product Name"
								maxLength={60}
								onInputChange={onProductNameInput}
								placeholder="Takla"
								readOnly={isLoading}
								style={{ textTransform: 'capitalize' }}
								type="text"
								value={field.name.value}
							/>
						</div>
						&nbsp;
						<div className="product-form-field">
							<Input
								field="brand"
								isRequired
								label="* Product Brand"
								maxLength={40}
								onInputChange={onProductBrandInput}
								placeholder="Bulus"
								readOnly={isLoading}
								style={{ textTransform: 'capitalize' }}
								type="text"
								value={field.brand.value}
							/>
						</div>
					</div>
					<div className="product-form-field product-textarea">
						<Input
							cols={37}
							field="description"
							isRequired={false}
							label="Product Description"
							maxLength={200}
							onInputChange={onProductDescriptionInput}
							placeholder="Nice Description"
							readOnly={isLoading}
							rows={5}
							type="textarea"
							value={field.description.value}
						/>
					</div>
					<div className="d-flex">
						<div className="product-form-field">
							<Input
								field="price"
								isRequired
								label="* Price"
								onInputChange={onProductPriceInput}
								placeholder="Product Price"
								readOnly={isLoading}
								type="number"
								value={field.price.value}
							/>
						</div>
						&nbsp;
						<div className="product-form-field">
							<Input
								field="maxQuantity"
								isRequired
								label="* Stock Total"
								onInputChange={onProductMaxQuantityInput}
								placeholder="Stock Total"
								readOnly={isLoading}
								type="number"
								value={field.maxQuantity.value}
							/>
						</div>
					</div>
					<br />
					<div className="product-form-field product-form-submit">
						<button
							className="button"
							disabled={isLoading}
							type="submit"
						>
							<CircularProgress
								theme="light"
								visible={isLoading}
							/>
							{isLoading ? 'Saving Product' : 'Save Product'}
						</button>
					</div>
				</div>
				<div className="product-form-file">
					<div className="product-form-field">
						<span className="d-block padding-s">* Thumbnail</span>
						<input
							disabled={isLoading}
							hidden
							id="product-input-file"
							onChange={e => onFileChange(e, { name: 'image', type: 'single' })}
							readOnly={isLoading}
							type="file"
						/>
						{!isFileLoading && (
							<label htmlFor="product-input-file">
								Choose Image
							</label>
						)}
					</div>
					{(imageFile.image.url || field.imageUrl.value) && (
						<div className="product-form-img-wrapper">
							<ImageLoader
								alt=""
								className="product-form-image-preview"
								src={imageFile.image.url || field.imageUrl.value}
							/>
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

ProductForm.propTypes = {
	isLoading: PropTypes.bool,
	onSubmit: PropTypes.func,
	product: PropTypes.shape({
		name: PropTypes.string,
		brand: PropTypes.string,
		price: PropTypes.number,
		maxQuantity: PropTypes.number,
		description: PropTypes.string,
		keywords: PropTypes.arrayOf(PropTypes.string),
		image: PropTypes.string
	})
};

export default ProductForm;
