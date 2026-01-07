package service

import (
	"THTINDOBAT/model"
	"THTINDOBAT/repository"
	"errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrderService struct {
	db        *gorm.DB
	orderRepo *repository.OrderRepository
}

type CreateOrderRequest struct {
	ProductID       uint `json:"product_id"`
	Quantity        int  `json:"quantity"`
	DiscountPercent int  `json:"discount_percent"`
}

func NewOrderService(db *gorm.DB, orderRepo *repository.OrderRepository) *OrderService {
	return &OrderService{
		db:        db,
		orderRepo: orderRepo,
	}
}

func (s *OrderService) CreateOrder(req CreateOrderRequest) (*model.Order, error) {
	if req.ProductID == 0 || req.Quantity <= 0 || req.DiscountPercent < 0 || req.DiscountPercent > 100 {
		return nil, errors.New("input tidak valid")
	}

	tx := s.db.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var product model.Product
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("id = ?", req.ProductID).
		First(&product).Error; err != nil {
		tx.Rollback()
		return nil, errors.New("produk tidak ditemukan")
	}

	if product.Stock < req.Quantity {
		tx.Rollback()
		return nil, errors.New("stok tidak cukup / habis")
	}

	rawTotal := product.Price * req.Quantity
	discount := (rawTotal * req.DiscountPercent) / 100
	totalPay := rawTotal - discount

	product.Stock -= req.Quantity
	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	order := &model.Order{
		ProductID:       product.ID,
		Quantity:        req.Quantity,
		Discount: 		 req.DiscountPercent,
		TotalPrice:      totalPay,
	}

	if err := s.orderRepo.Create(tx, order); err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return order, nil
}
