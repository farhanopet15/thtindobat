package repository

import (
	"THTINDOBAT/model"

	"gorm.io/gorm"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) List() ([]model.Product, error) {
	var products []model.Product
	if err := r.db.Order("id desc").Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *ProductRepository) Create(p *model.Product) error {
	return r.db.Create(p).Error
}