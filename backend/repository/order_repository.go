package repository

import (
	"THTINDOBAT/model"

	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(tx *gorm.DB, o *model.Order) error {
	return tx.Create(o).Error
}